import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  isHovered: boolean;
}

const AnimatedDownloadIcon = ({ isHovered }: Props) => {
  return (
    <div
      className={cn(
        "size-8 min-w-8 rounded-full relative overflow-hidden",
        isHovered ? "bg-yellow-300" : "bg-black"
      )}
    >
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-1/2",
          isHovered ? "text-neutral-900" : "text-yellow-300 "
        )}
        animate={{
          y: ["-150%", "15%", "0", "0", "-15%", "150%"],
          opacity: 1,
        }}
        transition={{
          duration: 2,
          times: [0, 0.1, 0.2, 0.7, 0.8, 1],
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.1,
        }}
      >
        <ArrowDown size={17} strokeWidth={5} />
      </motion.div>
    </div>
  );
};

export default AnimatedDownloadIcon;
