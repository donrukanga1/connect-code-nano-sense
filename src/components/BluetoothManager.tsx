
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bluetooth, Wifi, WifiOff, Settings } from "lucide-react";
import { toast } from "sonner";

interface BluetoothManagerProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export const BluetoothManager = ({ isConnected, onConnectionChange }: BluetoothManagerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<any[]>([]);
  const deviceRef = useRef<BluetoothDevice | null>(null);

  const handleConnect = async () => {
    try {
      setIsScanning(true);
      
      // Check if Web Bluetooth is supported
      if (!navigator.bluetooth) {
        toast.error("Web Bluetooth is not supported in this browser. Please use Chrome or Edge.");
        return;
      }

      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "Arduino" },
          { namePrefix: "Nano" },
          { services: ["battery_service"] }
        ],
        optionalServices: ["battery_service", "device_information"]
      });

      deviceRef.current = device;
      
      // Add disconnect listener
      device.addEventListener('gattserverdisconnected', handleDisconnect);
      
      // Connect to the device
      const server = await device.gatt?.connect();
      
      if (server) {
        onConnectionChange(true);
        toast.success(`Connected to ${device.name || 'Arduino Device'}`);
        console.log('Connected to Arduino:', device.name);
      }
      
    } catch (error: any) {
      console.error('Bluetooth connection error:', error);
      
      if (error.name === 'NotFoundError') {
        toast.error("No Arduino device found. Make sure your Arduino Nano 33 BLE is in pairing mode.");
      } else if (error.name === 'NotAllowedError') {
        toast.error("Bluetooth access denied. Please allow Bluetooth permissions.");
      } else {
        toast.error("Failed to connect to Arduino. Please try again.");
      }
      
      onConnectionChange(false);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDisconnect = () => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    onConnectionChange(false);
    toast.info("Disconnected from Arduino");
    console.log('Disconnected from Arduino');
  };

  const sendCodeToArduino = async (code: string) => {
    if (!isConnected || !deviceRef.current) {
      toast.error("Not connected to Arduino");
      return;
    }

    try {
      // This would implement the actual code transfer protocol
      // For now, we'll simulate the upload
      toast.info("Uploading code to Arduino...");
      
      // Simulate upload delay
      setTimeout(() => {
        toast.success("Code uploaded successfully!");
      }, 2000);
      
    } catch (error) {
      console.error('Code upload error:', error);
      toast.error("Failed to upload code to Arduino");
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
              ? 'bg-green-500/20 border-green-500/30 text-green-300' 
              : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <span>{isConnected ? 'Connected' : 'Connect Arduino'}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
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
                <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                  {isConnected ? 'Connected to Arduino Nano 33 BLE' : 'Not connected'}
                </span>
                {isConnected ? (
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20 border-red-500/30 text-red-300"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isScanning}
                    variant="outline"
                    size="sm"
                    className="bg-blue-500/20 border-blue-500/30 text-blue-300"
                  >
                    {isScanning ? 'Scanning...' : 'Connect'}
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
                  <li>Upload a Bluetooth sketch to your Arduino</li>
                  <li>Power on your Arduino board</li>
                  <li>Click "Connect" and select your device</li>
                  <li>Allow Bluetooth permissions in your browser</li>
                </ol>
              </div>
              
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  <strong>Note:</strong> Web Bluetooth requires HTTPS and is supported in Chrome, Edge, and Opera browsers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
