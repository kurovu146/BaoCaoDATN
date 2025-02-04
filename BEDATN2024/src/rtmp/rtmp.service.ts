import NodeMediaServer from 'node-media-server';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { firebaseStorage } from '../common/firebase.service';
import { unlink } from 'fs';
import { Injectable } from '@nestjs/common';
import { RecordService } from 'src/record/record.service';

@Injectable()
export class RtmpService {
  private recordProcesses: Map<string, ChildProcessWithoutNullStreams> = new Map();
  
  constructor(
    private recordService: RecordService
  ) {}

  async createRtmpServer() {
    const nodeMediaServer = new NodeMediaServer({
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
      },
      http: {
        port: 8000,
        mediaroot: './media', // Đường dẫn lưu trữ tệp media
        allow_origin: '*',
      }
    });

    nodeMediaServer.run();

    nodeMediaServer.on('preConnect', (id, args) => {
      console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    });

    nodeMediaServer.on('postPublish', (id, streamKey, args) => {
      console.log('[NodeEvent on postPublish]', `id=${id} streamKey=${streamKey}`);
    });

    nodeMediaServer.on('donePublish', (id, streamKey, args) => {
      console.log('[NodeEvent on donePublish]', `id=${id} streamKey=${streamKey}`);
      // Dừng ghi khi stream kết thúc
      this.stopRecord(streamKey);
    });
  }

  async startRecord(userId: number, streamKey: string): Promise<string> {
    const filePath = `recordings/${streamKey.replace(/\//g, '_')}${Date.now()}.mp4`;
    const ffmpegProcess = spawn('ffmpeg', [
      '-i', `rtmp://127.0.0.1:1935/live/${streamKey}`,  // Input stream
      '-c:v', 'libx264',                                // Codec video
      '-preset', 'ultrafast',                           // Cài đặt tốc độ
      '-c:a', 'aac',                                    // Codec âm thanh
      '-f', 'mp4',                                      // Định dạng file
      '-movflags', '+faststart',                        // Đặt metadata ở đầu file
      '-y', filePath,                                   // Đường dẫn tệp đầu ra
    ], {shell : true});

    this.recordProcesses.set(streamKey, ffmpegProcess);

    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`[FFmpeg data] ${data}`);
    });

    ffmpegProcess.on('close', async (code) => {
      if (code !== 1) {
        console.log(`Uploading file ${filePath} to Firebase...`);
        try {
          // Upload file lên Firebase
          const [file] = await firebaseStorage.upload(filePath, {
            destination: `videos/${streamKey}_${Date.now()}.mp4`, // Đường dẫn lưu trữ trên Firebase
            metadata: {
              contentType: 'video/mp4',
            },
          });
          await this.recordService.create({userId, url: file.metadata.mediaLink});

          // Xóa file cục bộ sau khi upload
          unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting local file: ${err}`);
            } else {
              console.log(`Local file deleted: ${filePath}`);
            }
          });
        } catch (error) {
          console.error('Error uploading to Firebase:', error);
        }
      } else {
        console.error(`Recording process exited with code ${code}`);
      }
    });

    return filePath;
  }

  stopRecord(streamKey: string): void {
    const process = this.recordProcesses.get(streamKey);

    if (process) {
      process.stdin.write("q\n");
      process.kill('SIGINT');
      this.recordProcesses.delete(streamKey);
    }
  }
}
