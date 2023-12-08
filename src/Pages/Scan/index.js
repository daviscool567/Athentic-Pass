import React, { useRef, useState, useEffect } from 'react'
import { Button, CustomInput, Spinner } from 'reactstrap/';
import { decrypt } from './encryption';
import qrcode from './plugin';
import { setHistory } from '../../services/auth'
import './index.css'
import Unverified from '../../Pages/Account/Unverified'
import { withRouter } from 'react-router';

var cam = 1;
var cameraAvailable = [];
var cameraPick = [];
function Scan(props) {

  const [state, setState] = useState("START SCAN");
  const [strm, setStream] = useState("");
  // const [camSwitch, setCamSwitch] = useState([]);
  const [currentCam, setCurrentCam] = useState(0);
  const [err, setErr] = useState({ error: false, errorMessage: "" });


  let width = window.innerWidth;
  if (width > 550) width = 550;
  let height = window.innerHeight;
  height = Math.round((height / 4) * 2.4);
  let spinnerText = false ? 'border' : "none";

  var gCtx = null;
  var gCanvas = null;
  var stype = 0;
  var gUM = false;
  var webkit = false;
  var moz = false;
  var v = null;
  var vidhtml = '<video playsinline style="width:90vw; height:60vh;" id="v" autoplay></video>';

  function initCanvas(w, h) {
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
  }


  function captureToCanvas() {
    let bCode = "";
    if (stype != 1)
      return;
    if (gUM && cam) {
      try {
        gCtx.drawImage(v, 0, 0);
        try {
          if (!('BarcodeDetector' in window)) {
            qrcode.decode();
          } else {
            let myImageData = gCtx.getImageData(0, 0, v.videoWidth, v.videoHeight);
            let barcodeDetector = new window.BarcodeDetector();
            barcodeDetector.detect(myImageData)
              .then(barcodes => {
                bCode = barcodes.map(barcode => barcode.rawValue).join(', ');
                if (bCode.toString().length > 5) {
                  read(bCode.toString())
                } else {
                  setTimeout(captureToCanvas, 50);
                }
              })
          }
        }
        catch (e) {
          if (cam) {
            console.log(e);
            setTimeout(captureToCanvas, 50);
          }
        };
      }
      catch (e) {
        if (cam) {
          setTimeout(captureToCanvas, 50);
        }
      };
    }
  }


  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function tryParseJSON(jsonString) {
    try {
      var o = JSON.parse(jsonString);
      if (o && typeof o === "object") {
        return true;
      }
    } catch (e) { }
    return false;
  };

  function read(a) {
    // let decryptObj = decrypt(a.toString());
    if (tryParseJSON(decrypt(a))) {
      let jsonD = JSON.parse(decrypt(a.toString()));
      setHistory(jsonD);
      props.history.push({
        pathname: '/history',
        json: { data: jsonD, valid: true }
      });
    } else {
      if (a.toString()) {
        props.history.push({
          pathname: '/history',
          json: { data: "", valid: false }
        });
      }
    }
  }

  function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
  function success(stream) {

    v.srcObject = stream;
    v.play();

    gUM = true;
    setTimeout(captureToCanvas, 50);
  }

  function error(error) {
    gUM = false;
    return;
  }


  function showInfo() {

  }




  function load() {
    if (isCanvasSupported() && window.File && window.FileReader && state === "START SCAN") {
      setState("STOP SCAN");
      cam = 1;
      initCanvas(800, 600);
      qrcode.callback = read;
      setwebcam();
      if (!('BarcodeDetector' in window)) {
        setTimeout(setErr({ error: true, errorMessage: "Please position your hand properly" }), 2000);
        setTimeout(setErr({ error: false, errorMessage: "" }), 4000);
      }
    }
    else {
      cam = false;
      gCtx = null;
      document.getElementById("outdiv").innerHTML = '';
      document.getElementById("result").innerHTML = '';
      stype = 0;
      gUM = false;
      webkit = false;
      moz = false;
      v = null;
      vidhtml = '<video playsinline style="width:90vw; height:57vh;" id="v" autoplay></video>';
      strm.getTracks().forEach(function (track) {
        if (track.readyState == 'live' && track.kind === 'video') {
          track.stop();
        }
      });
      setState("START SCAN")
    }
  }

  function switchChange(e) {
    if (e.target.checked && e.target.id * 1 !== currentCam) {
      let i = e.target.id * 1;
      setCurrentCam(i);
      setwebcam2(cameraAvailable[i]);
    }
    // setCamSwitch(e.target.checked)
    // console.log(e.target.checked)
    // if (e.target.checked && camSwitch.length > 1) {
    //   setwebcam2(camSwitch[1]);
    // } else if (!e.target.checked && camSwitch.length > 1) {
    //   setwebcam2(camSwitch[0]);
    // }
  }

  useEffect(() => {
    // navigator.mediaDevices.getUserMedia({ video: true })
  })


  function setwebcam() {

    var options = true;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        // navigator.mediaDevices.enumerateDevices()
        //   .then(function (devices) {
        //     console.log(devices)
        //     devices.forEach(function (device) {
        //       if (device.kind === 'videoinput') {
        //         cameraAvailable.push({ 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' });
        //         if (device.label.toLowerCase().search("back") > -1)
        //           options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' };
        //       }
        //       console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        //     });
        //   });
        options = cameraAvailable[0];
        setwebcam2(options);
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      setErr({ error: true, errorMessage: "Please use google chrome or latest browser support." })
      console.log("no navigator.mediaDevices.enumerateDevices");
      setwebcam2(options);
    }
  }

  function setwebcam2(options) {
    console.log(options);
    document.getElementById("result").innerHTML = "- scanning -";
    if (stype == 1) {
      setTimeout(captureToCanvas, 50);
      return;
    }
    var n = navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v = document.getElementById("v");


    if (n.mediaDevices.getUserMedia) {
      n.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } }, audio: false }).
        then(function (stream) {
          success(stream);
          setStream(stream);
        })
      // .catch(function (error) {
      //   error(error)
      // });
    }
    else
      if (n.getUserMedia) {
        webkit = true;
        n.getUserMedia({ video: options, audio: false }, success, error);
      }
      else
        if (n.webkitGetUserMedia) {
          webkit = true;
          n.webkitGetUserMedia({ video: options, audio: false }, success, error);
        }
    stype = 1;
    setTimeout(captureToCanvas, 50);
  }


  return (<>
    {err.error ? <Unverified data={err.errorMessage} /> : ""}
    <div className="scanner" >
      <div id="outdiv" ></div>
      <div id="result" style={{ position: "absolute", bottom: "35%", color: "white" }}></div>
      <canvas id="qr-canvas" style={{ display: "none", width: width + "px", borderRadius: "1em", height: (height - 100) + "px" }}></canvas>
      <div className="scanButton" style={{
        position: "absolute", bottom: "0"
      }}>
        <Button color="dark" onClick={load} disabled={spinnerText == 'border' ? true : false}   >{state}</Button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "0.5em" }}>
          {/* <p>Camera</p>
        <div style={{ display:"flex"}}>
          {cameraPick.map((data,idx)=>(
            <><CustomInput checked={currentCam === idx ? true : false} onChange={switchChange} type="radio" id={idx} key={idx} name="camera"/></>
          ))}
        </div> */}
        </div>
      </div>
    </div>
  </>
  )
}

export default withRouter(Scan)