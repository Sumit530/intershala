// const pupeteer = require("puppeteer")
const express = require("express")
const app = express()
const cron = require("node-cron")
const mongoose = require("mongoose")
const pupeteer = require('puppeteer-extra')
const moment = require('moment')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pupeteer.use(StealthPlugin())
pupeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())


require("dotenv").config()
function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
const multer = require("multer")

global.working = false 


mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res)=>{
  console.log("connect");
}).catch((err)=>{
  console.log(err);
})
const Tmp = require("./model/url")
app.get("/",(req,res)=>{
    Tmp.find().then((data)=>{
      
      console.log(data)
      res.render("index",{data,working})
  })
})
app.post("/senddata",multer().array(),async(req,res)=>{
  console.log(req.body)

  try{

    const Data = await Tmp.find({url:req.body.url})
    
    if(Data.length>0){
      return res.json({status:-1,message:"Duplicate Value"})
    }else{
      const storeData = new Tmp({
        url:req?.body?.url ?req?.body?.url : "",
        skill:req?.body?.skill ? req.body.skill.split(",") : [],
      degree:req?.body?.degree ? req?.body?.degree : "",
    })
    await storeData.save()
    return res.json({status:1,message:"Addedd Successfully"})
  }
}catch(err){
  console.log(err)
  return res.json({status:0,message:"Internal Server Error"})
}
})

app.post("/deletedata",multer().array(),async(req,res)=>{
  try{

    const data = await Tmp.find({_id:req.body.id})
    if(data.length>0){
      await Tmp.findOneAndDelete({_id:req.body.id})
      return res.json({status:1,message:"Deleted Successfully"})
    }else{
      return res.json({status:0,message:"Data Not Found"})
    }
  }catch(err){
    console.log(err)
    return res.json({status:0,message:"Internal Server Error"})
  }
})
app.post("/restart",multer().array(),async(req,res)=>{
  try{
    console.log(working)
if(working == false){

  working = true
  res.json({status:1,msg:'restarted succefully'})
  await login()
}else{
  res.json({status:1,msg:'already working'})
}
  }catch(err){
    console.log(err)
    working = false
    //  return res.json({status:0,message:"Internal Server Error"})
  }
})

const login = async() => {
const url = "ws://localhost:9222/devtools/browser/a5e90073-bd04-4f73-ab37-208aa46a93c4"
const browser = await pupeteer.launch({headless:'new',
  // browserWSEndpoint:url,
   args: ["--no-sandbox"]
  // executablePath:"C:/Program Files (x86)/AVAST Software/Browser/Application/AvastBrowser.exe"
  // executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"
  // executablePath:"C:/Users/Sharma/AppDataLocal/Programs/Opera/opera.exe"
}
  )

  try{
    // const context = await browser.createIncognitoBrowserContext();
    const page = await browser.newPage();
    console.log('started')
    // https://internshala.com/login/employer
// const domain = "https://internshala.com/login/user"
 const domain = "https://internshala.com/hire-talent"
    // navigate to a website and set the viewport
//     await page.setUserAgent(
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
// );
    await page.setViewport({ width: 1520, height: 1080 });
    
    await page.goto(domain, {
      timeout: 3000000
    });
    console.log('opend')
    var isLoged = false
    
    await page.waitForSelector("#header_login_button")
    await page.click("#header_login_button")
    // await page.waitForSelector("#employer")
    // await page.click("#employer")
    await page.waitForSelector('input[type="email"]')
    await page.type('input[type="email"]','tastemedia22@gmail.com',{delay:100})
    await page.type('input[type="password"]','Tasti$420',{delay:100})
    await delay(2000)
    // await page.click('#login_submit',{count:1,delay:1000})
    await page.click('#modal_login_submit',{count:1,delay:1000})
    console.log('login')
    await delay(10000)
    console.log('looking')
    isLoged = await page.$eval("#internships_tbody", () => true).catch(() => false) 
    console.log(new Date())
    console.log(moment().utc())
    console.log(moment().local())
    while(isLoged == false){
      
    //   // await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    //   await delay(3000)
    //   await page.waitForSelector("#employer")
    // await page.click("#employer")
    // await page.waitForSelector('input[type="email"]')
    // await page.type('input[type="email"]','tastemedia22@gmail.com',{delay:100})
    // await page.type('input[type="password"]','Tasti$420',{delay:100})
    //  await delay(2000)
    // console.log('login')
    await delay(2000)
    await page.evaluate(() => {
      for (const btn of document.querySelectorAll('.close_action')) {
        console.log(btn)
        btn.click();
      }
    });
    console.log('looking')
    await delay(2000)
    await page.screenshot({ path: 'fullpage.png', fullPage: true });
    await page.click('#modal_login_submit',{count:2,delay:1000})
      // await page.waitForSelector(".close_action")
      // await page.click('.close_action',{count:1,delay:1000})
      
      // console.log('closed')
      // await delay(2000)
      
      // console.log('trying')
      // await delay(2000)
      // await page.click('#login_submit',{count:2,delay:1000})
      // console.log('login')
      await delay(2000)
      // console.log('looking')
      // console.log(await page.content());
      // await page.screenshot({ path: 'fullpage.png', fullPage: true });

      isLoged = await page.$eval("#internships_tbody", () => true).catch(() => false) 
      // pupeteer.Keyboard.press('Escape')
      // await page.keyboard.press('Escape');

      

    }
    
    await page.waitForSelector("#internships_tbody")
    console.log('after')
    
      const Data = await Tmp.find({finished:{$ne: new Date().getDate()}}).sort({})
      console.log(Data.length)
    // const Data = [{
    //   url:"https://internshala.com/employer/applications/2232471/1/invite"
    // },{
    //   url:"https://internshala.com/employer/applications/2234796/1/invite"
    // }]
     console.log(Data);

     for(let e=0;e<Data.length;e++){
       await page.goto(Data[e].url)
       console.log('url ')
       await  Tmp.findOneAndUpdate({_id:Data[e]._id},{current:true})
       console.log('updated')
       
       const countElement  = await page.waitForSelector("#invited_applications_count") 
       await delay(5000)
       var existSkill = await countElement.evaluate((el) => el.textContent)
      // const getExhust = await page.waitForSelector(".access_db_limit_exhausted") 
      // console.log(getExhust)
      const exhusted = await page.$eval("div.show_access_db_limit_exhausted", () => true).catch(() => false)
      if(exhusted){
          continue;  
      }
       if(parseInt(existSkill)>0){

         await page.waitForSelector("#skill_filter")
         // await page.type("#skill_filter","content writing",{delay:50})
         await delay(2000)
         for(let i=0;i<Data[e].skill.length;i++){
           console.log(i)
           await (await page.$('#skill_filter')).type(Data[e].skill[i],{delay:200})
           
           await page.waitForSelector("#ui-id-2")
           await delay(3000)
           await (await page.$('#skill_filter')).press('Tab');
           await delay(3000)
           
          }
          if(Data[e].degree.length>0){

            // await (await page.$('#skill_filter')).press('Tab');
            // await delay(500)
            await (await page.$('#degree_filter')).type(Data[e].degree.substring(0,7),{delay:500})
            await page.waitForSelector("#ui-id-3")
            await delay(3000)
            await (await page.$('#degree_filter')).press('Tab');
          }
          
          await delay(500)
          await page.$eval('input[name="assignment_not_sent_app_received_filter"]', check => check.checked = true);
          await page.click('#apply_filter')
          await delay(3000)
          
        }

     var exists =  await page.$eval("div.individual_application", () => false).catch(() => true)
     
     //  await delay(5000)
     await delay(2000)
     
     if(exists != true){
        const FilteredElement  = await page.waitForSelector("#filtered_results_count") 
       let FilteredCount = await FilteredElement.evaluate((el) => el.textContent)
console.log(FilteredCount)
let repeat = 0
     
     do {
       preCount = await getCount(page);
      console.log(preCount)
      await scrollDown(page);
      await delay(1000)
       postCount = await getCount(page);
      if(preCount == postCount){
        repeat = repeat+1
      }
      
    } while (postCount < FilteredCount && repeat<4);

    await delay(2000)
    await page.evaluate(() => {
      for (const checkbox of document.querySelectorAll('.select_individual_application')) {
        console.log(checkbox)
        if (!checkbox.checked) checkbox.click();
      }
    });
    await delay(2000)
    
    await page.click('#group_invite')
    await delay(2000)
    await page.click('#chat_send_button')
  }
     async function getCount(page) {
      return await page.$$eval('div.individual_application', a => a.length);
    }

     async function scrollDown(page) {
      await page.evaluate(() => {
        window.scrollTo(0, window.document.body.scrollHeight);
      });
      // await page.$eval('.individual_application:last-child', e => {
      //   e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
      // });
    }
   
    

    //  while(exists != true){
    //   const elhndle  = await  page.$$("button.send_message")
    //   await elhndle[0].evaluate(async(x)=>{
    //     await x.click()
    //    })
    //    await page.waitForSelector("#chat_send_button")
    //    const elhndle2  = await  page.$$("button#chat_send_button")
    //    elhndle2[0].evaluate(async(x)=>{
    //      x.click()
    //    })
    //    await  new Promise(function(resolve) { 
    //      setTimeout(resolve, 3000)
    //    });
       
    //    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    //    console.log("after refresh");
    //    await  new Promise(function(resolve) { 
    //      setTimeout(resolve, 2000)
    //    });
    //     exists = await page.$eval("div.individual_application", () => false).catch(() => true)
    //     console.log(exists)
    //  }
      await delay(3000)
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      await delay(3000)
    const countElement1  = await page.waitForSelector("#invited_applications_count") 
       
       var existSkill1 = await countElement1.evaluate((el) => el.textContent)
     if(parseInt(existSkill1)>0){

       await page.waitForSelector(".clear_filter_form_only")
       await page.click(".clear_filter_form_only")
       await delay(500)
       await page.click('#apply_filter')
       await delay(5000)
       
       exists = await page.$eval("div.individual_application", () => false).catch(() => true)
        if(exists != true){
          const FilteredElement  = await page.waitForSelector("#filtered_results_count") 
          let FilteredCount = await FilteredElement.evaluate((el) => el.textContent)
   console.log(FilteredCount)
        
        do {
         preCount = await getCount(page);
         console.log(preCount)
         await scrollDown(page);
         await delay(1000)
         postCount = await getCount(page);
       } while (postCount < FilteredCount);
       await page.evaluate(() => {
        for (const checkbox of document.querySelectorAll('.select_individual_application')) {
          console.log(checkbox)
          if (!checkbox.checked) checkbox.click();
        }
      });
      await delay(2000)
      await page.click('#group_skip')
      await delay(2000)
        }
       let pose = 0
      //  while(exists != true){
         
      //    if(pose == 9){
      //     pose = 0
      //     await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      //     await delay(2000)
      //    }
      //    const elhndle  = await  page.$$("button.skip")
      //    await elhndle[pose].evaluate(async(x)=>{
      //      await x.click()
      //     })
      //     await delay(2000)
      //     exists = await page.$eval("div.individual_application", () => false).catch(() => true)
      //     await delay(1000)
      //     pose++
      //   }


      }
      
      await page.click('#new_applications')
      await delay(1000)
      const elment  = await page.waitForSelector("#new_applications_count") 
      var application_recieved = await elment.evaluate((el) => el.textContent)
      if(parseInt(application_recieved)>0){

        await delay(500)
        for(let i=0;i<Data[e].skill.length;i++){
          await (await page.$('#skill_filter')).type(Data[e].skill[i],{delay:200})
          
          await page.waitForSelector("#ui-id-2")
          await delay(3000)
          await (await page.$('#skill_filter')).press('Tab');
          await delay(3000)
        }
        await page.$eval('input[name="assignment_not_sent_app_received_filter"]', check => check.checked = true);
        await delay(500)
        await page.click('#apply_filter')
        await delay(2000)    
      }
     var existApplication = await page.$eval("div.individual_application", () => false).catch(() => true)
     if(existApplication != true){
      await page.waitForSelector("#select_all")
      await page.$eval('input[id="select_all"]', check => check.click());
      await page.waitForSelector("#group_assignment")
      await delay(4000)
      await page.click("#group_assignment")
      await delay(4000)
      // await page.click('#group_assignment')
      const elhndle3  = await  page.$$("button#submit_assignment_btn")
      elhndle3[0].evaluate(async(x)=>{
        x.click()
       })
     }

    //  if(parseInt(application_recieved)>0){
    //   await page.waitForSelector(".clear_filter_form_only")
    //   await delay(4000)
    //   await page.click(".clear_filter_form_only") 
    //   await delay(4000)
    //   await page.waitForSelector("#select_all")
    //   await page.$eval('input[id="select_all"]', check => check.click());
    //   await page.waitForSelector("#group_assignment")
    //   await delay(4000)
    //   await page.click("#rejected")
    //   await delay(1000)
    //   // await page.click('#group_assignment')
    //  }
   
    await page.click('#shortlisted_applications')
     await delay(4000)
     await page.$eval('input[name="assignment_not_sent_shortlisted_filter"]', check => check.checked = true);
     await delay(2000)
     await page.click('#apply_filter')
     await delay(1000) 
   
     var existSort = await page.$eval("div.individual_application", () => false).catch(() => true)
     if(existSort != true){
       await page.waitForSelector("#select_all")
       await page.$eval('input[id="select_all"]', check => check.click());
       await page.waitForSelector("#group_assignment")
       await delay(1000)
       await page.click("#group_assignment")
       await delay(1000)
       // await page.click('#group_assignment')
       const elhndle3  = await  page.$$("button#submit_assignment_btn")
       elhndle3[0].evaluate(async(x)=>{
         x.click()
        })
        await delay(1000)
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      }
      await delay(5000)
       await  Tmp.findOneAndUpdate({_id:Data[e]._id},{finished:new Date().getDate(),current:false})
    
    }
    working = false 
    await browser.close()
    console.log('closed browser')

  }catch(err){
    working = false 
    console.log(err)
    browser.close()
  } 
          // await page.click('#select_all')
          // await delay(500)
          // await page.click('#group_assignment')
          // await page.waitForSelector("#submit_assignment_btn")
          // await page.click('#submit_assignment_btn')
        
        
}
cron.schedule("* 10 * * *",async()=>{
   try{
    if(working != true){

      working = true
      await login()
    }
   }catch(error){
      console.log(error)
      working = false
   }
})



app.set('view engine', 'ejs')
app.listen(2020)