// document references prueba.html document, not index.html document.
'use strict';

class RobotI
{
    constructor(robotId){
        var self = this;
        this.velocity = {x:0, y:0, z:0, ax:0, ay:0, az:0};
        this.robot = document.getElementById(robotId);
        this.robot.addEventListener('body-loaded', this.setVelocity.bind(self));
        this.startCamera();
    }
    getRotation(){
      return this.robot.getAttribute('rotation');
    }
    setV(v){
        this.velocity.x = v;
    }
    setW(w){
        this.velocity.ay = w*10;
    }
    setL(l){
        this.velocity.y = l;
    }
    getV(){
        return this.velocity.x;
    }
    getW(){
        return this.velocity.ay;
    }
    getL(){
        return this.velocity.y;
    }
    setVelocity(body){
      /*
        This code run continiously, setting the speed of the robot every 40ms
        This function will not be callable, use setV, setW or setL
      */

      if(body != undefined){
        this.robot = body.originalTarget;
      }
      let rotation = this.getRotation();

      let newpos = updatePosition(rotation, this.velocity, this.robot.body.position);

      this.robot.body.position.set(newpos.x, newpos.y, newpos.z);
      this.robot.body.angularVelocity.set(this.velocity.ax, this.velocity.ay, this.velocity.az);
      setTimeout(this.setVelocity.bind(this), 30);
    }

    setCameraDescription(data /* , current */)
    {
        console.log("setCameraDescription: "+ data);
    }

    getCameraDescription()
    {
        return 1;
    }
    stopCameraStreaming()
    {
        return 1;
    }

    reset()
    {
        this.velocity = {x:0, y:0, z:0, ax:0, ay:0, az:0};
        this.robot.body.position.set(0,0,0);
        this.stopRaycaster();
        return 1;
    }

    getImageDescription()
    {
        return 1;
    }

    getImageFormat()
    {
        return 1;
    }
    startCamera(){
      // Starts camera from robot
      if (($('#spectatorDiv').length) && (document.querySelector("#spectatorDiv").firstChild != undefined)) {
        this.canvas2d = document.querySelector("#camera2");

        this.getImageData_async();
      }else{
        setTimeout(this.startCamera.bind(this), 100);
      }
    }
    getImage(){
      // Returns a screenshot from the robot camera
      if(this.imagedata != undefined){
        return this.imagedata;
      }else{
        setTimeout(this.getImage.bind(this), 200);
      }
    }

    getImageData_async()
    {
        this.imagedata = cv.imread('camera2');

        //console.log(this.imagedata);
        setTimeout(this.getImageData_async.bind(this), 33);
    }

    startRaycaster(distance)
    {
      this.raycaster = document.querySelector('#positionSensor');
      this.raycaster.setAttribute('raycaster', 'objects', '.collidable');
      this.raycaster.setAttribute('raycaster', 'far', distance);
      this.raycaster.setAttribute('raycaster', 'showLine', true);
      this.raycaster.setAttribute('raycaster', 'direction', "1 0 0");
      this.raycaster.setAttribute('raycaster', 'interval', 100);
      this.raycaster.setAttribute('raycaster', 'enabled', true);
      this.raycaster.setAttribute('raycaster', 'end', "3 0 0");
      this.raycaster.setAttribute('line', 'color', "#ffffff");
      this.raycaster.setAttribute('line', 'opacity', 1);
      this.raycaster.setAttribute('line', 'end', "1 0 0");
      this.setListener();
    }

    stopRaycaster()
    {
      this.raycaster = document.querySelector('#positionSensor');
      this.raycaster.removeAttribute('raycaster');
      this.raycaster.removeAttribute('line');
    }

    setListener()
    {
      this.raycaster.addEventListener('intersection-detected', function(evt){
          this.detected = true;
      }.bind(this));
    }

    checkCollides()
    {
      if(this.detected){
        this.detected = false;
        return true;
      }else{
        return this.detected;
      }
    }
}

function updatePosition(rotation, velocity, robotPos){
  let x = velocity.x/10 * Math.cos(rotation.y * Math.PI/180);
  let z = velocity.x/10 * Math.sin(rotation.y * Math.PI/180);

  robotPos.x += x;
  robotPos.z -= z;

  return robotPos;
}
