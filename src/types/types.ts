
// Types from GameScene
export type MeshTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};
export type MeshListItem = {
  Object: string;
  Location: number[];
  Rotation: number[];
  Scale: number[];
};
export type MeshTransformsByObject = {
  [objectName: string]: MeshTransform[];
};
