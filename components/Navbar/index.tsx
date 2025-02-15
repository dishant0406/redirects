import Logo from '../Micro/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const UserAvatar: React.FC = () => {
  return (
    <Avatar className="border rounded-full border-input bg-input">
      <AvatarImage src="https://api.dicebear.com/9.x/notionists/svg" />
      <AvatarFallback className="w-full h-full flex items-center rounded-full justify-center">
        RL
      </AvatarFallback>
    </Avatar>
  );
};

const getUserAvatarWithTooltip = (): React.ReactNode => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <UserAvatar />
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          <TooltipContent>
            <p>Login</p>
          </TooltipContent>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Navbar: React.FC = () => {
  return (
    <div className="w-full flex h-nav px-4 items-center justify-between border-b border-input">
      <div className="flex items-center justify-center gap-2">
        <Logo className="border border-white" height={50} width={50} />
        <div>
          <h1 className="text-xl font-bold">redirect.</h1>
          <p className="text-sm -mt-1 font-bold">lazyweb.rocks</p>
        </div>
      </div>
      {getUserAvatarWithTooltip()}
    </div>
  );
};

export default Navbar;
