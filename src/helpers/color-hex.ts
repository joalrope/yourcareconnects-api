import { IService } from "../models";

export interface IRes {
  service: string;
  color: string;
}

export const colors = [
  "#000080",
  "#00008B",
  "#0000CD",
  "#0000FF",
  "#006400",
  "#008000",
  "#008080",
  "#008B8B",
  "#00BFFF",
  "#00FF00",
  "#191970",
  "#1E90FF",
  "#20B2AA",
  "#228B22",
  "#2E8B57",
  "#2F4F4F",
  "#32CD32",
  "#3CB371",
  "#4169E1",
  "#4682B4",
  "#483D8B",
  "#48D1CC",
  "#4B0082",
  "#556B2F",
  "#6610f2",
  "#696969",
  "#6A5ACD",
  "#6B8E23",
  "#708090",
  "#778899",
  "#7B68EE",
  "#800000",
  "#800080",
  "#808000",
  "#808080",
  "#8A2BE2",
  "#8B0000",
  "#8B008B",
  "#8B4513",
  "#9370D8",
  "#9400D3",
  "#9932CC",
  "#9ACD32",
  "#A0522D",
  "#A52A2A",
  "#B22222",
  "#BA55D3",
  "#C71585",
  "#CD5C5C",
  "#CD853F",
  "#D2691E",
  "#D87093",
  "#DA70D6",
  "#DAA520",
  "#DC143C",
  "#dc3545",
  "#F08080",
  "#FF0000",
  "#FF00FF",
  "#FF1493",
  "#FF4500",
  "#FF6347",
  "#FF7F50",
  "#FF8C00",
  "#FFA500",
  "#007bff",
];

export const randomColorHex = () => {
  const hexadecimal = "0123456789ABCDEF";
  let color = "#";

  for (var i = 0; i < 6; i++) {
    color = color + hexadecimal[Math.floor(Math.random() * 16)];
  }

  return color;
};

export const setColorHex = (services: IService[]) => {
  services.map((service) => {
    service.tagColor = colors[Math.floor(Math.random() * 66)];

    if (service.children!.length > 0) {
      const newServices: IService[] = service.children as IService[];

      setColorHex(newServices);
    }
  });
};

export const getColorHex = (
  services: IService[],
  title: string,
  serviceColorInit: IRes[] = []
) => {
  let serviceColor: IRes[] = serviceColorInit;

  services.map((service) => {
    if (service.title === title) {
      serviceColor.push({ service: title, color: service.tagColor });
    }
    if (service.children!.length > 0) {
      const newServices: IService[] = service.children as IService[];

      getColorHex(newServices, title, serviceColor);
    }
    return serviceColor;
  });

  return serviceColor;
};
