import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bluetooth, Wifi, WifiOff, Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BluetoothManagerProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
  onCodeUpload?: (code: string) => Promise<void>;
}

interface DeviceInfo {
  id: string;
  name: string | null;
}

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const CHUNK_SIZE = 20; // BLE MTU is typically 23 bytes, leaving room for headers

export const BluetoothManager = ({
  isConnected,
  onConnectionChange,
  onCodeUpload,
}: BluetoothManagerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<DeviceInfo[]>([]);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const txCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const handleDisconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    deviceRef.current = null;
    txCharacteristicRef.current = null;
    onConnectionChange(false);
    setAvailableDevices([]);
    toast.info("Disconnected from Arduino");
  }, [onConnectionChange]);

  const handleConnect = async () => {
    if (!navigator.bluetooth) {
      toast.error("Web Bluetooth is not supported. Use Chrome or Edge on HTTPS.");
      return;
    }

    try {
      setIsScanning(true);

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "Arduino" }, { namePrefix: "Nano" }],
        optionalServices: [UART_SERVICE_UUID],
      });

      deviceRef.current = device;
      device.addEventListener("gattserverdisconnected", handleDisconnect);

      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server");
      }

      const service = await server.getPrimaryService(UART_SERVICE_UUID);
      txCharacteristicRef.current = await service.getCharacteristic(
        UART_TX_CHARACTERISTIC_UUID
      );

      setAvailableDevices([{ id: device.id, name: device.name }]);
      onConnectionChange(true);
      toast.success(`Connected to ${device.name || "Arduino Device"}`);
    } catch (error: any) {
      console.error("Bluetooth connection error:", error);
      if (error.name === "NotFoundError") {
        toast.error("No Arduino device found. Ensure Nano 33 BLE is in pairing mode.");
      } else if (error.name === "SecurityError") {
        toast.error("Bluetooth access denied. Allow permissions and use HTTPS.");
      } else {
        toast.error(`Connection failed: ${error.message}`);
      }
      onConnectionChange(false);
    } finally {
      setIsScanning(false);
    }
  };

  const sendCodeToArduino = async (code: string) => {
    if (!isConnected || !deviceRef.current || !txCharacteristicRef.current) {
      toast.error("Not connected to Arduino");
      return;
    }

    if (!code.trim()) {
      toast.error("No code to upload");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading code to Arduino...");

      // Encode code as UTF-8
      const encoder = new TextEncoder();
      const codeBytes = encoder.encode(code);
      
      // Send code in chunks
      for (let i = 0; i < codeBytes.length; i += CHUNK_SIZE) {
        const chunk = codeBytes.slice(i, i + CHUNK_SIZE);
        await txCharacteristicRef.current.writeValueWithResponse(chunk);
      }

      // Notify parent component (if provided)
      if (onCodeUpload) {
        await onCodeUpload(code);
      }

      toast.success("Code uploaded successfully!");
    } catch (error: any) {
      console.error("Code upload error:", error);
      toast.error(`Failed to upload code: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 ${
            isConnected
              ? "bg-green-500/20 border-green-500/30 text-green-300"
              : "bg-blue-500/20 border-blue-500/30 text-blue-300"
          }`}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bluetooth className="w-4 h-4" />
          )}
          <span>{isConnected ? "Connected" : "Connect Arduino"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bluetooth className="w-5 h-5 text-blue-400" />
            <span>Arduino Bluetooth Connection</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-400" />
                )}
                <span>Connection Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isConnected ? "text-green-400" : "text-gray-400"}`}>
                  {isConnected
                    ? `Connected to ${deviceRef.current?.name || "Arduino Nano 33 BLE"}`
                    : "Not connected"}
                </span>
                {isConnected ? (
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20 border-red-500/30 text-red-300"
                    disabled={isUploading}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isScanning || isUploading}
                    variant="outline"
                    size="sm"
                    className="bg-blue-500/20 border-blue-500/30 text-blue-300"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Scanning...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Setup Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-300">
                <p className="mb-2">To connect your Arduino Nano 33 BLE Sense Rev2:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Upload a BLE UART sketch (e.g., from ArduinoBLE library) to your Arduino.</li>
                  <li>Power on your Arduino board.</li>
                  <li>Click "Connect" and select your device from the browser prompt.</li>
                  <li>Allow Bluetooth permissions when prompted.</li>
                </ol>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  <strong>Note:</strong> Web Bluetooth requires HTTPS and is supported in Chrome, Edge, and Opera. Ensure your Arduino is in discoverable mode.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
