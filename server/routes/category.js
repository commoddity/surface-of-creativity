const express = require('express');
const router = express.Router();
const moment = require('moment');
const middleware = require('connect-ensure-login');
const Category = require('../database/Schema').EventCategory;

router.get('/all',
  async (req, res) => {
    res.locals.categories = await Category.find({ status: 'Live' });
    res.render('categories/categories', { pageTitle: `Categories` });
  });

router.get('/admin/list/asdf123',
  async (req, res) => {
    res.locals.categories = await Category.find();
    res.render('categories/list-categories', { pageTitle: `Categories` });
  });
router.get('/create',
  (req, res) => {
    res.render('categories/create-category', { category: null });
  });

router.get('/delete/:id',
  async (req, res) => {
    try {
      await Category.deleteOne({ _id: req.params.id })
      res.redirect('/category/admin/list/asdf123');
    } catch (error) {
      console.log(`error`, error);
    }
  });
router.get('/edit/:id',
  async (req, res) => {
    try {
      const category = res.locals.category = await Category.findById(req.params.id)
      res.render('categories/create-category', { pageTitle: `Edit Category | ${category.title}` });
    } catch (error) {
      console.log(`error`, error);
    }
  });

router.get('/category/:category_id', async (req, res) => {
  try {
    const search = res.locals.search = `${req.params.category_id}`;
    res.locals.categories = await Category.find({ status: 'Live', $or: [{ 'category_id': { '$regex': search, '$options': 'i' } }, { 'subcategory_id': { '$regex': search, '$options': 'i' } }] });
    res.render('categories/categories', { pageTitle: `Categories | ${req.params.category_id}` });
  } catch (error) {
    console.log(`error`, error);
  }
});

router.get('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = res.locals.category = await Category.findById(categoryId);
    res.render('categories/category', { pageTitle: `Category | ${category.title}` });
  } catch (error) {
    console.log(`error`, error);
  }
});

router.post('/create/:categoryId?', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (categoryId) {
      await Category.updateOne({ _id: categoryId }, req.body);
    } else {
      req.body.status = 'Review';
      var category = await new Category(req.body).save();
    }
    res.redirect(`/category/admin/list/asdf123`);
  } catch (error) {
    console.log(`error`, error);
  }
});

module.exports = router;
