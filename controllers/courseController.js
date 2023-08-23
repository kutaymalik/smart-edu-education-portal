import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";

const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash("success", `${course.name} has been created succesfully!`);
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", `Something Happened: ${error}`);
    res.status(400).redirect("/courses");
  }
};

const getAllCourses = async (req, res) => {
  try {
    // Getting query name
    const categorySlug = await req.query.categories;
    const query = req.query.search;

    // Assign query to category
    const category = await Category.findOne({ slug: categorySlug });

    // Initialize filter
    let filter = {};

    // If there is a query assign category id to filter
    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ""), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdTime")
      .populate("user");

    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      pageName: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const categories = await Category.find();
    res.status(200).render("course", {
      course,
      pageName: "course",
      user,
      categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });

    req.flash("success", `${course.name} has been removed succesfully`);

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.slug = req.body.slug;

    course.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export {
  createCourse,
  getAllCourses,
  getCourse,
  enrollCourse,
  releaseCourse,
  deleteCourse,
  updateCourse,
};
