import { GitPullRequestCreateArrowIcon, Search } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Main: React.FC = async () => {
  return (
    <div className="h-main p-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Redirects</h1>
        <div className="flex justify-end gap-4">
          <Input placeholder="Search for a redirect" startIcon={<Search className="h-4 w-4" />} />
          <Button>
            <GitPullRequestCreateArrowIcon className="w-6 h-6" />
            Create redirect
          </Button>
        </div>
      </div>
      <div className="w-full mt-8"></div>
    </div>
  );
};

export default Main;
