var express = require('express');
var flog = require( './loggedin');
var router = express.Router();

function numberWithCommas(x) {
  var parts = x.toString().split(".");
 parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
      
router.get('/help', flog, (req, res) => {
  if(req.valid==3){
    res.render('login/views/invalidpages/banned');
  }
  else if(req.valid==1)
    res.render('home/views/help');
    else if(req.valid==2)
    res.render('home/views/invalidpages/adminonly');
    else
    res.render('login/views/invalid');
});
router.get('/rules', flog, (req, res) => {
  if(req.valid==3){
    res.render('login/views/invalidpages/banned');
  }
    else if(req.valid==1)
    res.render('home/views/rules');
      else if(req.valid==2)
      res.render('home/views/invalidpages/adminonly');
      else
      res.render('login/views/invalid');
    });

    
function finduser(req, res, next){
      var db = require('../../lib/database')();
      db.query("SELECT *,CURDATE(), TIMESTAMPDIFF(YEAR,datBirthday,CURDATE()) AS Age FROM tbluser WHERE strType= '1' AND intID!=?",[req.session.user], function (err, results, fields) {
        if (err) return res.send(err);
      var page = 1, pagearr = [1], curpage = [req.params.page], prevpage = [req.params.page - 1], nextpage = [parseInt(req.params.page)+1], lastpage = [], status = [];
      if (!results[0])
      console.log('');
      else{
        for(count=0;count<results.length;count++){
          results[count].page = page;
          results[count].curpage = req.params.page;
          if((count+1)%5==0){
            page+=1;
          }
        }
        lastpage[0] = results[results.length-1].page;
        status[0] = results[results.length-1].strStatus;
      }
      if(req.params.page > 5){
        pagearr[0] = req.params.page - 5;
      }
      for(count=1;count<10;count++){
        pagearr[count] = pagearr[count-1] + 1;
      }
      req.status = status;
      req.lastpage = lastpage;
      req.curpage = curpage;
      req.prevpage = prevpage;
      req.nextpage = nextpage;
      req.page = pagearr;
      req.stud = results;
      return next();
    });
  }
  
function renderuser(req,res){
    if(req.valid==3){
    res.render('login/views/invalidpages/banned');
  }
  if(req.valid==1){
    if(!req.stud[0]){
      if(req.params.page == 1)
        res.render('home/views/noposts');
        else
        res.render('login/views/noroute');
      }
    else if(req.params.page < 1 || req.params.page > req.lastpage[0])
    res.render('login/views/noroute');
    else
      res.render('home/views/index',{ usertab: req.user, studtab: req.stud, pagetab: req.page, curpagetab: req.curpage, prevpagetab: req.prevpage, nextpagetab: req.nextpage, lastpagetab: req.lastpage, statustab: req.status});
    }
  else if(req.valid==2)
    res.render('admin/views/invalidpages/normalonly');
    else
    res.render('login/views/invalid');
  }
router.get('/page/:page', flog, finduser, renderuser);

exports.home= router;

                      