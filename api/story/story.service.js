import mongodb from "mongodb";
const { ObjectId } = mongodb;

import { dbService } from "../../services/db.service.js";
import { logger } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";

async function query(
  filterBy = { txt: "", tag: "", byUserName: "", byUserId: "", likedById: "" }
) {
  try {
    const criteria = {};

    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, "i");
      criteria.$or = [{ txt: regex }, { description: regex }];
    }

    if (filterBy.tag) {
      criteria.tags = filterBy.tag;
    }

    if (filterBy.byUserName) {
      const regexName = new RegExp(filterBy.byUserName, "i");
      criteria["by.fullname"] = regexName;
    }

    if (filterBy.byUserId) {
      criteria["by._id"] = filterBy.byUserId;
    }

    if (filterBy.likedById) {
      criteria.likedBy = { $elemMatch: { _id: filterBy.likedById } };
    }

    const collection = await dbService.getCollection("story");
    const stories = await collection.find(criteria).toArray();
    return stories;
  } catch (err) {
    logger.error("cannot find stories", err);
    throw err;
  }
}

async function getById(storyId) {
  try {
    const collection = await dbService.getCollection("story");
    const story = await collection.findOne({ _id: ObjectId(storyId) });
    story.createdAt = ObjectId(story._id).getTimestamp();
    return story;
  } catch (err) {
    logger.error(`while finding story ${storyId}`, err);
    throw err;
  }
}

async function remove(storyId) {
  try {
    const collection = await dbService.getCollection("story");
    await collection.deleteOne({ _id: ObjectId(storyId) });
  } catch (err) {
    logger.error(`cannot remove story ${storyId}`, err);
    throw err;
  }
}

async function add(story) {
  try {
    const collection = await dbService.getCollection("story");
    await collection.insertOne(story);
    return story;
  } catch (err) {
    logger.error("cannot insert story", err);
    throw err;
  }
}

async function update(story) {
  try {
    const storyToSave = {
      comments: story.comments,
      tags: story.tags,
      likedBy: story.likedBy,
    };
    const collection = await dbService.getCollection("story");
    await collection.updateOne(
      { _id: ObjectId(story._id) },
      { $set: storyToSave }
    );
    return story;
  } catch (err) {
    logger.error(`cannot update story ${storyId}`, err);
    throw err;
  }
}

async function addStoryMsg(storyId, msg) {
  try {
    msg.id = utilService.makeId();
    const collection = await dbService.getCollection("story");
    await collection.updateOne(
      { _id: ObjectId(storyId) },
      { $push: { msgs: msg } }
    );
    return msg;
  } catch (err) {
    logger.error(`cannot add story msg ${storyId}`, err);
    throw err;
  }
}

async function removeStoryMsg(storyId, msgId) {
  try {
    const collection = await dbService.getCollection("story");
    await collection.updateOne(
      { _id: ObjectId(storyId) },
      { $pull: { msgs: { id: msgId } } }
    );
    return msgId;
  } catch (err) {
    logger.error(`cannot add story msg ${storyId}`, err);
    throw err;
  }
}

export const storyService = {
  remove,
  query,
  getById,
  add,
  update,
  addStoryMsg,
  removeStoryMsg,
};
