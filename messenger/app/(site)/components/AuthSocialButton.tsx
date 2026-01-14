
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  label: string;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center w-full gap-3
        rounded-xl bg-white px-4 py-3
        text-gray-700 font-medium
        shadow-md ring-1 ring-gray-200
        hover:bg-gray-50 transition
      "
    >
      <Icon size={20} />
      <span className="flex-1 text-center">{label}</span>
    </button>
  );
};

export default AuthSocialButton;
