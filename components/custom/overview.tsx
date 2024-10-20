import { motion } from "framer-motion";
import Link from "next/link";

import { LogoOpenAI, MessageIcon, VercelIcon, BotIcon } from "./icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[500px] mt-20 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <BotIcon />
          <span>+</span>
          <BotIcon />
          <span>+</span>
          <BotIcon />
        </p>
        <p>
          Welcome to ACAI! You can think of ACAI as your personal team of AI Agents. 
        </p>
        <p>
          Similar to AI chat interfaces you will be able to type in a request for ACAI to help you with. 
          Contrast to other AI chats, you will have a team of AI agents spring into action to help fulfill your request. 
        </p>
        <p>
          We can't wait for you to witness the power of Collaborative AI!
        </p>
        <p>
          {" "}
          Try starting with: "Book a dinner tomorrow at 7pm, I'm in the mood for Chinese"{" "}
        </p>
      </div>
    </motion.div>
  );
};
