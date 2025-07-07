import { useEffect, useRef, useState } from "react"
// import { gameManager } from "../core/GameManager";

// Simple audioEffect utility for playing sound effects
const audioEffect = {
  _audio: null as HTMLAudioElement | null,
  play({ url, force }: { url: string; force?: boolean }) {
    if (!this._audio) {
      this._audio = new window.Audio(url);
    } else {
      if (force) {
        this._audio.pause();
        this._audio.currentTime = 0;
        this._audio.src = url;
      }
    }
    this._audio.play();
  },
};
// TODO: Move audioEffect to a shared utility file if used elsewhere

export function Menu() {
  const [login, setLogin] = useState(false);
  const [menu12, setMenu12] = useState(false);
  const [doorCreate, setDoorCreate] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);

  const onStartClick = () => {
    audioEffect.play({ url: "/Genshin/Genshin Impact [Duang].mp3", force: true });
    // gameManager.emit("start")
    setLogin(false)
  }

  useEffect(() => {
    // gameManager.on("doorCreate", () => {
    //   setDoorCreate(true)
    // }, true, true);
    // gameManager.on("openDoor", () => {
    //   setOpenDoor(true)
    //   setMenu12(false)
    // }, true, true);
    setTimeout(() => {
      setLogin(true);
      setMenu12(true)
    }, 500);
  }, [])

  return (
    <div className="h-full w-full absolute z-50 top-0 left-0 flex flex-col-reverse pointer-events-none">
      <div
        className="absolute transition-opacity duration-1000"
        style={{
          opacity: menu12 ? "0.9" : "0",
          padding: "0% 0%",
          margin: "0% 0%",
          height: "14vmin",
          width: "14vmin",
          top: "6vmin",
          right: "4%",
          backgroundImage: 'url("/Genshin/Tex_0096.png")',
          backgroundSize: "100% 100%"
        }}
      ></div>
      <div
        className="absolute flex flex-col-reverse transition-opacity duration-1000 h-full w-full"
        style={{ opacity: login ? "1" : "0" }}
      >
        <div
          className="absolute w-full"
          style={{
            height: "20%",
            background: "linear-gradient(to top, #2727279f, #00000000)"
          }}
        ></div>
        <div className="absolute flex flex-col items-start justify-end w-full" style={{ height: "20%" }}>
          <div className="pb-[1vmin] pl-[1vw] text-left w-[30%] float-left">
            <p className="text-[#232323e2] text-[0.4rem]">免责声明：</p>
            <p className="text-[#232323e2] text-[0.4rem]">本网站是一个纯粹的技术示例，旨在展示和分享我们的技术能力。网站的设计和内容受到《原神》的启发，并尽可能地复制了《原神》的登录界面。我们对此表示敬意，并强调这个项目不是官方的《原神》产品，也没有与《原神》或其母公司miHoYo有任何关联。</p>
            <p className="text-[#232323e2] text-[0.4rem]">我们没有，也无意从这个项目中获得任何经济利益。这个网站的所有内容仅供学习和研究目的，以便让更多的人了解和熟悉webgl开发技术。</p>
            <p className="text-[#232323e2] text-[0.4rem]">如果miHoYo或任何有关方面认为这个项目侵犯了他们的权益，请联系我们，我们会立即采取行动。</p>
          </div>
        </div>
        <button
          className="pointer-events-auto absolute float-right border-none outline-none transition-transform duration-200 cursor-pointer hover:scale-110 active:scale-90"
          style={{
            padding: "0% 0%",
            margin: "0% 0%",
            height: "7vmin",
            width: "7vmin",
            right: "4%",
            bottom: "6%",
            backgroundImage: 'url("/Genshin/ClickMe.png")',
            backgroundSize: "100% 100%",
            backgroundColor: "#00000000",
            cursor: 'url("/Genshin/T_Mouse.png"), default',
            transition: "all 0.2s"
          }}
          onClick={login ? onStartClick : () => { }}
        ></button>
        <button
          className="pointer-events-auto absolute float-right border-none outline-none transition-transform duration-200 cursor-pointer hover:scale-110 active:scale-90"
          style={{
            padding: "0% 0%",
            margin: "0% 0%",
            height: "7vmin",
            width: "7vmin",
            right: "4%",
            bottom: "16%",
            backgroundImage: 'url("/Genshin/jump.png")',
            backgroundSize: "100% 100%",
            backgroundColor: "#00000000",
            cursor: 'url("/Genshin/T_Mouse.png"), default',
            transition: "all 0.2s"
          }}
          onClick={login ? () => {
            window.open('https://www.bilibili.com/video/BV1E8411v7xy');
          } : () => { }}
        ></button>
      </div>
      {doorCreate && (
        <div
          className="absolute flex flex-col-reverse transition-opacity duration-500 h-full w-full"
          style={{ opacity: openDoor ? "0" : "1" }}
        >
          <div
            className="absolute flex justify-center items-center"
            style={{
              left: "2%",
              bottom: "4vmin",
              height: "4.5vmin",
              width: "96%",
              background: "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.482) 50%, rgba(0, 0, 0, 0) 100%)",
              animation: "doorCreate-background 0.5s ease-in-out forwards"
            }}
          >
            <div
              style={{
                height: "2.5vmin",
                width: "11.25vmin",
                backgroundImage: 'url("/Genshin/Entry.png")',
                backgroundSize: "100% 100%",
                animation: "doorCreate-entry 0.8s ease-in-out forwards"
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}