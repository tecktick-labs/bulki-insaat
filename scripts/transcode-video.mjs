/**
 * Tanıtım videosunun mobil ve Safari uyumlu sürümlerini üretir.
 *
 *   npm run transcode-video
 *
 * Kaynak 1280x720 VP9, 82 saniye, ~16 MB ve SES İÇERMEZ — bu yüzden tüm
 * çıktılarda ses akışı kapatılır (-an).
 *
 * Üretilenler:
 *   tanitim-mobile.webm  mobilde oynatılan küçük sürüm (VP9)
 *   tanitim-mobile.mp4   WebM desteklemeyen mobil Safari için (H.264)
 *   tanitim.mp4          masaüstü Safari için (H.264)
 */
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const dir = fileURLToPath(new URL("../src/assets/videos/", import.meta.url));
const source = `${dir}tanitim.webm`;

// Mobil hedef 640x360 / 24 fps: tam ekran arka planda, koyu degradenin altında
// orijinalden ayırt edilemiyor ama dosya beşte bire iniyor.
const jobs = [
  {
    out: "tanitim-mobile.webm",
    args: ["-vf", "scale=640:-2,fps=24", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "46",
           "-row-mt", "1", "-cpu-used", "4", "-deadline", "good", "-an"],
  },
  {
    out: "tanitim-mobile.mp4",
    args: ["-vf", "scale=640:-2,fps=24", "-c:v", "libx264", "-crf", "33", "-preset", "slow",
           "-profile:v", "main", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an"],
  },
  {
    out: "tanitim.mp4",
    args: ["-c:v", "libx264", "-crf", "27", "-preset", "slow",
           "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an"],
  },
];

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(`kaynak: tanitim.webm  ${mb(statSync(source).size)}\n`);

for (const job of jobs) {
  process.stdout.write(`${job.out.padEnd(22)} üretiliyor... `);
  execFileSync(ffmpeg, ["-y", "-i", source, ...job.args, `${dir}${job.out}`], { stdio: ["ignore", "ignore", "pipe"] });
  console.log(mb(statSync(`${dir}${job.out}`).size));
}
