
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

const Signup = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <div className="space-y-4">
          <RadioGroup defaultValue="user" className="flex justify-center gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="signup-user" />
              <Label htmlFor="signup-user">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seamstress" id="signup-seamstress" />
              <Label htmlFor="signup-seamstress">Seamstress</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Enter your full name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="Enter your email" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" placeholder="Create a password" />
          </div>

          <Button className="w-full">Create Account</Button>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
