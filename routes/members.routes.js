const { Router } = require("express");
const Members = require("../models/Members");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const members = await Members.findOne({ owner: req.user.userId });

    if (members) {
      return res.json(members.memberArray);
    }

    if (!members) {
      return res.json(null);
    }
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.post("/search", auth, async (req, res) => {
  try {
    const { substring } = req.body;

    let regex = new RegExp(substring, "i");

    const candidate = await Members.findOne({ owner: req.user.userId });
    let arr;

    if (candidate) {
      arr = candidate.memberArray.map((item) => {
        return JSON.stringify(item.id);
      });
    }

    User.aggregate(
      [
        {
          $project: {
            fullname: { $concat: ["$name", " ", "$surname"] },
            doc: "$$ROOT",
          },
        },
        { $match: { fullname: regex } },
      ],
      function (err, persons) {
        persons = persons.map((item) => {
          const str = JSON.stringify(item.doc._id);

          let check;

          if (candidate) {
            check = arr.includes(str);
          }

          if (!check && str !== JSON.stringify(req.user.userId)) {
            return {
              _id: item.doc._id,
              imgURL: item.doc.imgURL,
              name: item.doc.name,
              surname: item.doc.surname,
            };
          }

          return false;
        });

        while (persons.includes(false)) {
          persons.map((item, index) => {
            if (!item) {
              persons.splice(index, 1);
            }
          });
        }

        if (err) {
          return res
            .status(500)
            .json({ message: "Что-то пошло не так, попробуйте снова" });
        }

        res.json(persons);
      }
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/add", auth, async (req, res) => {
  try {
    const { memberArray } = req.body;

    const candidate = await Members.findOne({ owner: req.user.userId });

    let arr;
    let check;

    if (candidate) {
      arr = candidate.memberArray.map((item) => {
        return JSON.stringify(item.id);
      });

      check = arr.includes(JSON.stringify(memberArray[0].id));
    }

    if (candidate && !check) {
      Members.findOneAndUpdate(
        { owner: req.user.userId },
        { $push: { memberArray } },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            console.log("success");
          }
        }
      );

      return res.status(201).json({ message: "Друг создан" });
    }

    if (check) {
      return res
        .status(400)
        .json({ message: "Этот человек уже есть в списке ваших друзей" });
    }

    const members = new Members({
      memberArray,
      owner: req.user.userId,
    });

    await members.save();

    res.status(201).json({ message: "Друг создан" });
  } catch (e) {
    res.status(500).json({ errorMessage: e.message });
  }
});

router.post("/delete", auth, async (req, res) => {
  try {
    let newMembers;

    function deleteArray(index) {
      candidate.memberArray.splice(index, 1);
      console.log(candidate.memberArray);
      newMembers = candidate.memberArray;
    }

    const { id } = req.body;
    const candidate = await Members.findOne({ owner: req.user.userId });

    await candidate.memberArray.map((item, index) => {
      if (item.id === id) {
        deleteArray(index);
      }
    });

    await Members.findOneAndDelete(
      {
        owner: req.user.userId,
      },
      { id }
    );

    const members = new Members({
      memberArray: newMembers,
      owner: req.user.userId,
    });

    await members.save();

    return res.status(201).json({ message: "Удалено" });
  } catch (e) {}
});

module.exports = router;
