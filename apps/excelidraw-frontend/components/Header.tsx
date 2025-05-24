import Link from "next/link";
import DoodleButton from './DoodleButton';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-doodle-paper/90 backdrop-blur-sm border-b-3 border-doodle-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-doodle-purple rounded-lg flex items-center justify-center transform rotate-12">
              <span className="text-white font-gamja font-bold text-lg">E</span>
            </div>
            <span className="font-gamja font-bold text-2xl text-doodle-sketch">EXCELIDRAW</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-doodle-sketch hover:text-doodle-purple transition-colors font-gamja">
              Features
            </a>
            <a href="#create" className="text-doodle-sketch hover:text-doodle-purple transition-colors font-gamja">
              Create
            </a>
            <a href="#collaborate" className="text-doodle-sketch hover:text-doodle-purple transition-colors font-gamja">
              Collaborate
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <DoodleButton variant="outline" size="sm">
                Sign in
              </DoodleButton>
            </Link>
            <Link href="/signup">
              <DoodleButton variant="primary" size="sm">
                Free whiteboard
              </DoodleButton>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;