import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getStories, getStoryById, addStory, updateStory, removeStory, addStoryMsg, removeStoryMsg } from './story.controller.js'

export const storyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

storyRoutes.get('/', log, getStories)
storyRoutes.get('/:id', getStoryById)
storyRoutes.post('/',  addStory)
storyRoutes.put('/:id',  updateStory)
storyRoutes.delete('/:id',  removeStory)
// storyRoutes.post('/', requireAuth, addStory)
// storyRoutes.put('/:id', requireAuth, updateStory)
// storyRoutes.delete('/:id', requireAuth, removeStory)
// router.delete('/:id', requireAuth, requireAdmin, removeStory)

storyRoutes.post('/:id/msg', requireAuth, addStoryMsg)
storyRoutes.delete('/:id/msg/:msgId', requireAuth, removeStoryMsg)