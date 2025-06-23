import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameSettings = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog open={isOpen} modal={false}>
      <DialogTrigger asChild>
        <button
          className="w-full text-left p-2 hover:bg-neutral-400/20 rounded-sm text-sm cursor-default"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Ajustes del juego
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-zinc-900 border border-white"
      ></DialogContent>
    </Dialog>
  );
};

export default GameSettings;
