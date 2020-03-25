const express = require('express');
const router = express.Router();
const { EventCategory, Event } = require('../database/Schema');

router.get('/create',
  (req, res) => {
    res.render('categories/create-category', { category: null });
  });

router.get('/delete/:id',
  async (req, res) => {
    try {
      await EventCategory.deleteOne({ _id: req.params.id })
      res.redirect('/admin/categories');
    } catch (error) {
      console.log(`error`, error);
    }
  });
router.get('/edit/:id',
  async (req, res) => {
    try {
      const category = res.locals.category = await EventCategory.findById(req.params.id)
      res.render('categories/create-category', { pageTitle: `Edit Category | ${category.name}` });
    } catch (error) {
      console.log(`error`, error);
    }
  });


router.post('/create/:categoryId?', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (categoryId) {
      await EventCategory.updateOne({ _id: categoryId }, req.body);
      if (req.body.originalName != req.body.name) {
        await Event.updateMany({ category_id: req.body.originalName }, { category_id: req.body.name });
      }
    } else {
      req.body.status = 'Review';
      var category = await new EventCategory(req.body).save();
    }



    res.redirect(`/admin/categories`);
  } catch (error) {
    console.log(`error`, error);
  }
});

module.exports = router;
