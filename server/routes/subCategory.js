const express = require('express');
const router = express.Router();
const { EventCategory, EventSubCategory, Event } = require('../database/Schema');

router.get('/create',
  async (req, res) => {
    try {
      res.locals.eventCategories = await EventCategory.find()
      res.render('sub-categories/create-sub-category', { category: null });
    } catch (error) {
      console.log(`error`, error);
    }
  });

router.get('/delete/:id',
  async (req, res) => {
    try {
      await EventSubCategory.deleteOne({ _id: req.params.id })
      res.redirect('/admin/sub-categories');
    } catch (error) {
      console.log(`error`, error);
    }
  });
router.get('/edit/:id',
  async (req, res) => {
    try {
      res.locals.eventCategories = await EventCategory.find()
      const category = res.locals.category = await EventSubCategory.findById(req.params.id)
      res.render('sub-categories/create-sub-category', { pageTitle: `Edit Category | ${category.name}` });
    } catch (error) {
      console.log(`error`, error);
    }
  });


router.post('/create/:categoryId?', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    console.log(`req.body`,req.body);
    if (categoryId) {
      await EventSubCategory.updateOne({ _id: categoryId }, req.body);
      if (req.body.originalName != req.body.name) {
        await Event.updateMany({ subcategory_id: req.body.originalName }, { subcategory_id: req.body.name });
      }
    } else {
      req.body.status = 'Review';
      var category = await new EventSubCategory(req.body).save();
    }



    res.redirect(`/admin/sub-categories`);
  } catch (error) {
    console.log(`error`, error);
  }
});

module.exports = router;
