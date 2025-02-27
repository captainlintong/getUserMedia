/*
 * @Author: tong.lin
 * @Date: 2025-02-24 18:19:11
 * @LastEditors: tong.lin
 * @LastEditTime: 2025-02-24 18:32:26
 * @FilePath: /meeting/public/static/getReceiverCsrc_worker.js
 * Copyright (c) 2025 by 263智联, All Rights Reserved.
 */

let oldAudio = '';
self.onmessage = (e) => {
  const {
    status,
    audioCsrcs,
    browser,
  } = e.data;

  if (status == 'start') {
    let audioCsrc;

    //解析audio 语音激励的值
    if (audioCsrcs) {
      audioCsrc = audioCsrcs;
      if (browser == "Firefox") {
        audioCsrc = audioCsrc.sort(
          (a, b) => {
            var time1 = a["timestamp"];
            var time2 = b["timestamp"];
            return time2 - time1;
          }
        );
      } else if (browser == "Safari") {
        audioCsrc = audioCsrc
          .reverse()
          .sort((a, b) => {
            var time1 = a["timestamp"];
            var time2 = b["timestamp"];
            return time2 - time1;
          });
      } else {
        audioCsrc = audioCsrc
          .reverse()
          .sort((a, b) => {
            var time1 = a["timestamp"];
            var time2 = b["timestamp"];
            return time2 - time1;
          });
      }
      //      					console.log('audio csrc 是');
      //      					console.log(ReceiversCsrcInfo.getContributingSources());
      var voiceStimulationInfo = [];
      var audioCsrcInfoData = audioCsrc.find(audioCsrcInfo => {
        return audioCsrcInfo.source <= 3;
      });
      if (!audioCsrcInfoData) return;
      if (browser == "Safari") {
        audioCsrc = audioCsrc.filter(info => {
          return info.timestamp == audioCsrcInfoData.timestamp;
        });
      } else {
        audioCsrc = audioCsrc.filter(info => {
          return info.rtpTimestamp == audioCsrcInfoData.rtpTimestamp;
        });
      }
      //      					 console.log(audioCsrc);
      if (audioCsrc[0] && audioCsrc[0].source != audioCsrc.length - 1)
        return;
      audioCsrc.forEach((audioCsrcInfo, index) => {
        if (index != 0) {
          //获取语音激励值
          var voiceStimulationNum = audioCsrc[0].source & 0xffffffff; //数组第一个值第一个字节表示语音激励数量
          if (voiceStimulationNum && index <= voiceStimulationNum) {
            voiceStimulationInfo.push({
              ptid: audioCsrcInfo.source & 0x0000ffff,
              voiceNum: audioCsrcInfo.source >> 16
            });
          }
        }
      });
      if (
        JSON.stringify(voiceStimulationInfo) ===
        JSON.stringify(oldAudio)
      )
        return;
      oldAudio = voiceStimulationInfo;
      // console.log({
      // 	data: voiceStimulationInfo
      // }, '333333')
      postMessage({
        data: voiceStimulationInfo,
        type: 'audio'
      })
      //解析video的值
    }


  }

}
