
/*
 * GET home page.
 */


exports.index = function(req, res) {
  res.locals = {
    title: 'Title',
  };
  return res.render('index',{
    partials: {
      part: 'part',
    }
  });
};
