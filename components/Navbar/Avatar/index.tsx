import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Tooltip from '@/components/ui/tooltip';

const UserAvatar: React.FC<{
  email?: string;
}> = ({ email }) => {
  return (
    <Avatar className="border rounded-full border-input bg-input">
      <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${email}`} />
      <AvatarFallback className="w-full h-full flex items-center rounded-full justify-center">
        {email?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

const AvatarWithToolTip: React.FC<{
  user?: User;
}> = ({ user }) => {
  return (
    <Tooltip content={user?.email || 'Login'}>
      <UserAvatar />
    </Tooltip>
  );
};

export default AvatarWithToolTip;
