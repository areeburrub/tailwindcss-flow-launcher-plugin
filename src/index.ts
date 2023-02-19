import open from "open";
import axios from "axios";
import { Flow, JSONRPCResponse } from "flow-launcher-helper";
import { query } from "./api.js";

type Methods = "open_result" | "class_search";

const { requestParams, showResult, on, run } = new Flow<Methods>("app.png");

on("query", () => {
  if (requestParams.join(" ") === "") {
    return showResult({
      title: "Waiting for query...",
      subtitle: "open TailwindCSS docs",
      method: "open_result",
      params: ["https://tailwindcss.com/docs"],
      iconPath: "app.png",
    });
  }
  try {
    const data = query(requestParams.join(" "));
    const results: JSONRPCResponse<Methods>[] = [];

    data.forEach((item) => {
        
        let img =''
        if(item.classes){
            const text = item.classes;
            const regex = /rgb\((\d+)\s+(\d+)\s+(\d+)/;
            const match = text.match(regex);
            if (match != null) {
                const r = match[1];
                const g = match[2];
                const b = match[3];
                // @ts-ignore
                const hex = ((r << 16) | (g << 8) | b).toString(16);
                let hexCode =  ("000000" + hex).slice(-6);
                img='https://www.colorhexa.com/'+hexCode+'.png'
            }
            else{
                img = "app.png";
            }
        }else{
            img = "app.png";
        }


        results.push({
            title: item.selector,
            subtitle: item.classes == "false" ? "Open TailwindCSS docs" : item.classes,
            method: "open_result",
            params: [item.url || "https://tailwindcss.com/docs"],
            iconPath: img,
        });
    });

    showResult(...results);
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      return showResult({
        title: "Error",
        subtitle: err.message,
      });
    }
  }
});

// on('class_search', async () => {
//     return showResult({
//         title: 'Search TailwindCSS',
//         subtitle: requestParams.toString(),
//         method: 'class_search',
//         iconPath: 'app.png',
//     });
//     // if (params.length <= 1) {
//     // return showResult(
//     // {
//     //   title: "Waiting for query...",
//     //   subtitle: 'open TailwindCSS docs',
//     //   method: 'open_result',
//     //   params: ['https://tailwindcss.com/docs'],
//     //   iconPath: 'app.png',
//     // }
//     // );
//     // }
//     // try {
//     //   const data = query(params);
//     //   const results: JSONRPCResponse<Methods>[] = [];
//     //
//     //   data.forEach((item) => {
//     //     results.push({
//     //       title: item.selector,
//     //       subtitle: item.classes,
//     //       iconPath: 'app.png',
//     //     });
//     //   });
//     //
//     //   showResult(...results);
//     // } catch (err) {
//     //   if (axios.isAxiosError(err) || err instanceof Error) {
//     //     return showResult({
//     //       title: 'Error',
//     //       subtitle: err.message,
//     //     });
//     //   }
//     // }
// });

on("open_result", () => {
  const url = requestParams[0].toString();
  open(url);
});

run();
