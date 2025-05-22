import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function PrivateProfile({ userName, isCurrentUser }) {
  return (
    <div className="container mx-auto py-8 px-4 text-center min-h-[60vh] flex flex-col justify-center items-center">
      <Card className="max-w-md w-full p-6">
        <CardContent className="flex flex-col items-center pt-6">
          <div className="bg-muted rounded-full p-6 mb-4">
            <FaLock className="h-12 w-12 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Private Profile</h2>

          {isCurrentUser ? (
            <>
              <p className="text-muted-foreground mb-6 text-center">
                Your profile is currently set to private. Only you can see your
                full profile information.
              </p>
              <Button asChild>
                <Link to="/settings/privacy">Manage Privacy Settings</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-6 text-center">
                {userName}'s profile is private. The user has chosen to keep
                their information private.
              </p>
              <Button variant="outline" asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PrivateProfile;
