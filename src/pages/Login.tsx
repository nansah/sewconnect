
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

const Login = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <div className="space-y-4">
          <RadioGroup defaultValue="user" className="flex justify-center gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seamstress" id="seamstress" />
              <Label htmlFor="seamstress">Seamstress</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>

          <Button className="w-full">Login</Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
