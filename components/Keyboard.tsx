import { motion } from "framer-motion";

export const Keyboard = () => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full pb-2"
      style={{ 
        background: '#D1D5DB',
        borderTop: '0.5px solid #A8A8A8'
      }}
    >
      {/* Suggestions Bar */}
      <div className="flex gap-3 px-2 py-2 overflow-x-auto">
        <div className="px-4 py-1.5 bg-white rounded-md shadow-sm whitespace-nowrap">
          <span className="text-black text-[13px]">I</span>
        </div>
        <div className="px-4 py-1.5 bg-white rounded-md shadow-sm whitespace-nowrap">
          <span className="text-black text-[13px]">I'm</span>
        </div>
        <div className="px-4 py-1.5 bg-white rounded-md shadow-sm whitespace-nowrap">
          <span className="text-black text-[13px]">We</span>
        </div>
      </div>
      
      {/* iOS Keyboard Layout */}
      <div className="flex flex-col gap-[7px] px-[3px] py-2">
        {/* First Row */}
        <div className="flex justify-center gap-[6px]">
          {['Q','W','E','R','T','Y','U','I','O','P'].map((key) => <Key key={key} char={key} />)}
        </div>
        
        {/* Second Row */}
        <div className="flex justify-center gap-[6px] px-4">
          {['A','S','D','F','G','H','J','K','L'].map((key) => <Key key={key} char={key} />)}
        </div>
        
        {/* Third Row */}
        <div className="flex justify-center gap-[6px]">
          <div className="flex-shrink-0 h-[42px] px-2 bg-[#ACB3BA] rounded-md flex items-center justify-center shadow-sm" style={{ minWidth: '42px' }}>
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path d="M1 8L8 1M1 8L8 15M1 8H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {['Z','X','C','V','B','N','M'].map((key) => <Key key={key} char={key} />)}
          <div className="flex-shrink-0 h-[42px] px-3 bg-[#ACB3BA] rounded-md flex items-center justify-center shadow-sm" style={{ minWidth: '42px' }}>
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none">
              <path d="M20 2L8 14L2 8" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="flex justify-center gap-[6px]">
          <div className="flex-shrink-0 h-[42px] px-3 bg-[#ACB3BA] rounded-md flex items-center justify-center shadow-sm">
            <span className="text-black text-[15px] font-normal">123</span>
          </div>
          <div className="flex-shrink-0 h-[42px] px-3 bg-[#ACB3BA] rounded-md flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="black" strokeWidth="1.5"/>
              <path d="M5 9H13M9 5V13" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1 h-[42px] bg-white rounded-md flex items-center justify-center shadow-sm">
            <span className="text-black text-[16px]">space</span>
          </div>
          <div className="flex-shrink-0 h-[42px] px-4 bg-[#ACB3BA] rounded-md flex items-center justify-center shadow-sm">
            <span className="text-black text-[16px] font-normal">return</span>
          </div>
        </div>
      </div>
      
      {/* Home indicator */}
      <div className="flex justify-center pt-1 pb-1">
        <div className="w-32 h-1 bg-black rounded-full opacity-60"></div>
      </div>
    </motion.div>
  );
};

const Key = ({ char }: { char: string }) => (
  <div 
    className="flex-1 h-[42px] bg-white rounded-md flex items-center justify-center shadow-sm active:bg-gray-200 transition-colors"
    style={{ 
      minWidth: '30px',
      maxWidth: '36px'
    }}
  >
    <span className="text-black text-[22px] font-light">{char}</span>
  </div>
);
