// Tailwind CSS version, no .less import
import { useEffect, useRef, useState } from "react"
import { useProgress } from "@react-three/drei"

export function Preloader({ onFinish }: { onFinish?: () => void }) {
  const progressRef = useRef<HTMLDivElement>(null);
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress >= 100) {
      setTimeout(() => {
        setVisible(false)
      }, 1000)
      // Fade out after loading is complete
      const timeout = setTimeout(() => {
        if (onFinish) onFinish();
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [active, progress, onFinish]);

  // useEffect(() => {
  //   console.log('progress', progress)
  // }, [progress])


  return (
    <div
      className={`fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-white pointer-events-none transition-opacity duration-[1500ms] ease-in-out z-50 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundSize: '2vmin, 1vmin' }}
    >
      <div className="flex flex-col justify-center items-center animate-fadeIn">
        <img
          className="w-[45vmin] h-[35vmin] mb-[5vmin] transition-opacity duration-1000 delay-[1200ms]"
          src={"Genshin/Genshin.png"}
          alt="图片"
          style={{ opacity: visible ? 1 : 0 }}
        />
        <div className="w-[40vmin] rounded-[0.7vmin] transition-opacity duration-1000 delay-[1200ms] relative flex flex-col items-center">
          <div className="relative w-[41vmin] h-[1.2vmin] ml-[-0.5vmin] bg-gray-300" style={{ clipPath: 'polygon(0.5vmin 0, 40.5vmin 0, 100% 50%, 40.5vmin 100%, 0.5vmin 100%, 0 50%)' }}>
            <div
              ref={progressRef}
              className="h-full bg-neutral-800 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {/* Balls at the ends of the progress bar */}
          <div className="absolute top-[-1.2vmin] left-[-2vmin] w-[1.2vmin] h-[1.2vmin] bg-neutral-800" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <div className="absolute top-[-2.4vmin] left-[40.8vmin] w-[1.2vmin] h-[1.2vmin] bg-neutral-800" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <div className="pt-[1vmin] text-[1.4vmin]">为了您更好的体验，请在电脑端打开</div>
        </div>
      </div>
    </div>
  )
}