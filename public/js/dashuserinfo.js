const username1=document.getElementById('username1');
const username2=document.getElementById('username2');
const crs = document.getElementById('crs')
const cldr = document.getElementById('cldr')
const grades = document.getElementById('grades')
const noti = document.getElementById('noti')
const cr = document.getElementById('cr')
const fs = document.getElementById('fs')
const attendance = document.getElementById('attendance')
const signout = document.getElementById('signout')
const secsub = document.getElementById('--subjects')
const secgra = document.getElementById('-grades')
const secfee = document.getElementById('-fees')
const secpro = document.getElementById('-profile')
const seccal = document.getElementById('-calendar')
const secattend = document.getElementById('-attendance')
username2.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.add('active');
    secpro.style.display='block';
    secsub.style.zIndex=-1;
    secsub.style.position='absolute';
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='none';
})
crs.addEventListener('click',()=> {

    crs.classList.add('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='block';
    secsub.style.position='static';
    secsub.style.zIndex=1;
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='none';
})
cldr.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.add('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.zIndex=-1;
    secsub.style.position='absolute';
    secfee.style.display='none';
    seccal.style.display='block';
    secattend.style.display='none';
    secgra.style.display='none';
})
grades.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.add('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='none  !important';
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='block';
})
noti.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.add('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='none  !important';
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='none';
})
cr.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.add('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='none  !important';
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='none';
})
fs.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.add('active');
    attendance.classList.remove('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='none  !important';
    secfee.style.display='block';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='none';
})
attendance.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.add('active');
    signout.classList.remove('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='none  !important';
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='block';
    secgra.style.display='none';
})
signout.addEventListener('click',()=> {
    crs.classList.remove('active');
    cldr.classList.remove('active');
    grades.classList.remove('active');
    noti.classList.remove('active');
    cr.classList.remove('active');
    fs.classList.remove('active');
    attendance.classList.remove('active');
    signout.classList.add('active');
    username2.classList.remove('active');
    secpro.style.display='none';
    secsub.style.display='none';
    secfee.style.display='none';
    seccal.style.display='none';
    secattend.style.display='none';
    secgra.style.display='none';
})
$.getJSON("http://localhost:3000/api/currentUser",(user)=>{
  username1.innerText = user.username
  const fname = user.username.split(' ')[0];
  username2.innerHTML =' <i class="user circle icon -iconleft"></i>' + fname
})
$.getJSON("http://localhost:3000/api/currentUser",(user)=>{
  console.log(user.subjects)
  user.subjects.forEach(element => {
    console.log(element);
    secsub.innerHTML=`<div class="-twocard">
    <div class="-twocard1">${element.name}</div>
    <div class="-twocard2">detials</div>
    <div class="-twocard3">${element.teacher}</div>
    <div class="-twocard4"><a href="http://localhost:4000/${element.subid}"><button class="ui button">Join Class</button></div><a>
</div>`
  });
})

