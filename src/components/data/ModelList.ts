export const Models = [
  { title: 'Room', url: '/glb/bake.glb' },
  { title: 'Door', url: '/Genshin/Login/DOOR.glb' },
  { title: 'BigCloud', url: '/Genshin/Login/SM_BigCloud.glb' },
  { title: 'Light', url: '/Genshin/Login/SM_Light.glb' },
  { title: 'Qiao01', url: '/Genshin/Login/SM_Qiao01.glb' },
  { title: 'Qiao02', url: '/Genshin/Login/SM_Qiao02.glb' },
  { title: 'Qiao03', url: '/Genshin/Login/SM_Qiao03.glb' },
  { title: 'Qiao04', url: '/Genshin/Login/SM_Qiao04.glb' },
  { title: 'Road', url: '/Genshin/Login/SM_Road.glb' },
  { title: 'ZhuZi01', url: '/Genshin/Login/SM_ZhuZi01.glb' },
  { title: 'ZhuZi02', url: '/Genshin/Login/SM_ZhuZi02.glb' },
  { title: 'ZhuZi03', url: '/Genshin/Login/SM_ZhuZi03.glb' },
  { title: 'ZhuZi04', url: '/Genshin/Login/SM_ZhuZi04.glb' },
  { title: 'WhitePlane', url: '/Genshin/Login/WHITE_PLANE.glb' },
]


export const getModelByTitle = (title: string) => {
  return Models.find((model) => model.title === title)?.url
}

export const getModelsByTitles = (titles: string[]) => {
  return Models.filter((model) => titles.includes(model.title));
}