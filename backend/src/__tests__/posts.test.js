// import mongoose from 'mongoose'
// import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
// import {
//   createPost,
//   listAllPosts,
//   listPostsByAuthor,
//   listPostsByTag,
//   getPostById,
//   updatePost,
//   deletePost,
// } from '../services/posts.js'
// import { createTestUser } from '../test/helper.js'
// import { Post } from '../db/models/post.js'

// let userId
// let createdSamplePosts = []

// beforeAll(async () => {
//   userId = await createTestUser()
// })

// beforeEach(async () => {
//   await Post.deleteMany()
//   createdSamplePosts = []
//   const samplePosts = [
//     {
//       title: 'Learning Redux',
//       contents: 'Redux content',
//       tags: ['redux'],
//       author: userId,
//     },
//     {
//       title: 'Learn React Hooks',
//       contents: 'React hooks content',
//       tags: ['react'],
//       author: userId,
//     },
//     {
//       title: 'Full-Stack React Projects',
//       contents: 'Full-stack content',
//       tags: ['react', 'nodejs'],
//       author: userId,
//     },
//   ]

//   // Create sample posts in database
//   for (const post of samplePosts) {
//     const createdPost = new Post(post)
//     createdSamplePosts.push(await createdPost.save())
//   }
// })

// describe('creating posts', () => {
//   test('with all parameters should succeed', async () => {
//     const post = {
//       title: 'Hello Mongoose!',
//       contents: 'This post is stored in a MongoDB database using Mongoose.',
//       tags: ['mongoose', 'mongodb'],
//     }
//     const createdPost = await createPost(userId, post)
//     expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
//     const foundPost = await Post.findById(createdPost._id)
//     expect(foundPost).toEqual(expect.objectContaining(post))
//     expect(foundPost.createdAt).toBeInstanceOf(Date)
//     expect(foundPost.updatedAt).toBeInstanceOf(Date)
//   })

//   test('without title should fail', async () => {
//     const post = {
//       contents: 'Post with no title',
//       tags: ['empty'],
//     }
//     try {
//       await createPost(userId, post)
//     } catch (err) {
//       expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
//       expect(err.message).toContain('`title` is required')
//     }
//   })

//   test('with minimal parameters should succeed', async () => {
//     const post = {
//       title: 'Only a title',
//     }
//     const createdPost = await createPost(userId, post)
//     expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
//   })
// })

// describe('listing posts', () => {
//   // authorId = await createTestUser()
//   test('should return all posts', async () => {
//     const posts = await listAllPosts()
//     expect(posts.length).toEqual(createdSamplePosts.length)
//   })

//   test('should return posts sorted by creation date descending by default', async () => {
//     const posts = await listAllPosts()
//     const sortedSamplePosts = createdSamplePosts.sort(
//       (a, b) => b.createdAt - a.createdAt,
//     )
//     expect(posts.map((post) => post.createdAt)).toEqual(
//       sortedSamplePosts.map((post) => post.createdAt),
//     )
//   })

//   test('should take into account provided sorting options', async () => {
//     const posts = await listAllPosts({
//       sortBy: 'updatedAt',
//       sortOrder: 'ascending',
//     })
//     const sortedSamplePosts = createdSamplePosts.sort(
//       (a, b) => a.updatedAt - b.updatedAt,
//     )
//     expect(posts.map((post) => post.updatedAt)).toEqual(
//       sortedSamplePosts.map((post) => post.updatedAt),
//     )
//   })

//   test('should be able to filter posts by author', async () => {
//     const posts = await listPostsByAuthor('Daniel Bugl')
//     console.log(createdSamplePosts[0].author)
//     expect(posts.length).toBe(3)
//   })

//   test('should be able to filter posts by tag', async () => {
//     const posts = await listPostsByTag('nodejs')
//     expect(posts.length).toBe(1)
//   })
// })

// describe('getting a post', () => {
//   test('should return the full post', async () => {
//     const post = await getPostById(createdSamplePosts[0]._id)
//     expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
//   })

//   test('should fail if the id does not exist', async () => {
//     const post = await getPostById('000000000000000000000000')
//     expect(post).toEqual(null)
//   })
// })

// describe('updating posts', () => {
//   test('should update the specified property', async () => {
//     await updatePost(userId, createdSamplePosts[0]._id, {
//       title: 'Test Author',
//     })
//     const updatedPost = await Post.findById(createdSamplePosts[0]._id)
//     expect(updatedPost.title).toEqual('Test Author')
//   })

//   test('should not update other properties', async () => {
//     await updatePost(userId, createdSamplePosts[0]._id, {
//       contents: 'Test Author',
//     })
//     const updatedPost = await Post.findById(createdSamplePosts[0]._id)
//     expect(updatedPost.title).toEqual('Learning Redux')
//   })

//   test('should update the updatedAt timestamp', async () => {
//     await updatePost(userId, createdSamplePosts[0]._id, {
//       title: 'Test Author',
//     })
//     const updatedPost = await Post.findById(createdSamplePosts[0]._id)
//     expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
//       createdSamplePosts[0].updatedAt.getTime(),
//     )
//   })

//   test('should fail if the id does not exist', async () => {
//     const post = await updatePost(userId, '000000000000000000000000', {
//       title: 'Test Author',
//     })
//     expect(post).toEqual(null)
//   })
// })

// describe('deleting posts', () => {
//   test('should remove the post from the database', async () => {
//     const result = await deletePost(userId, createdSamplePosts[0]._id)
//     expect(result.deletedCount).toEqual(1)
//     const deletedPost = await Post.findById(createdSamplePosts[0]._id)
//     expect(deletedPost).toEqual(null)
//   })import mongoose from 'mongoose'
//   import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
//   import {
//     createPost,
//     listAllPosts,
//     listPostsByAuthor,
//     listPostsByTag,
//     getPostById,
//     updatePost,
//     deletePost,
//   } from '../services/posts.js'
//   import { createTestUser } from '../test/helper.js'
//   import { Post } from '../db/models/post.js'

//   let userId
//   let createdSamplePosts = []

//   beforeAll(async () => {
//     userId = await createTestUser()
//   })

//   beforeEach(async () => {
//     await Post.deleteMany()
//     createdSamplePosts = []
//     const samplePosts = [
//       {
//         title: 'Learning Redux',
//         contents: 'Redux content',
//         tags: ['redux'],
//         author: userId,
//       },
//       {
//         title: 'Learn React Hooks',
//         contents: 'React hooks content',
//         tags: ['react'],
//         author: userId,
//       },
//       {
//         title: 'Full-Stack React Projects',
//         contents: 'Full-stack content',
//         tags: ['react', 'nodejs'],
//         author: userId,
//       },
//     ]

//     // Create sample posts in database
//     for (const post of samplePosts) {
//       const createdPost = new Post(post)
//       createdSamplePosts.push(await createdPost.save())
//     }
//   })

//   describe('creating posts', () => {
//     test('with all parameters should succeed', async () => {
//       const post = {
//         title: 'Hello Mongoose!',
//         contents: 'This post is stored in a MongoDB database using Mongoose.',
//         tags: ['mongoose', 'mongodb'],
//       }
//       const createdPost = await createPost(userId, post)
//       expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
//       const foundPost = await Post.findById(createdPost._id)
//       expect(foundPost).toEqual(expect.objectContaining(post))
//       expect(foundPost.createdAt).toBeInstanceOf(Date)
//       expect(foundPost.updatedAt).toBeInstanceOf(Date)
//     })

//     test('without title should fail', async () => {
//       const post = {
//         contents: 'Post with no title',
//         tags: ['empty'],
//       }
//       try {
//         await createPost(userId, post)
//       } catch (err) {
//         expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
//         expect(err.message).toContain('`title` is required')
//       }
//     })

//     test('with minimal parameters should succeed', async () => {
//       const post = {
//         title: 'Only a title',
//       }
//       const createdPost = await createPost(userId, post)
//       expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
//     })
//   })

//   describe('listing posts', () => {
//     // authorId = await createTestUser()
//     test('should return all posts', async () => {
//       const posts = await listAllPosts()
//       expect(posts.length).toEqual(createdSamplePosts.length)
//     })

//     test('should return posts sorted by creation date descending by default', async () => {
//       const posts = await listAllPosts()
//       const sortedSamplePosts = createdSamplePosts.sort(
//         (a, b) => b.createdAt - a.createdAt,
//       )
//       expect(posts.map((post) => post.createdAt)).toEqual(
//         sortedSamplePosts.map((post) => post.createdAt),
//       )
//     })

//     test('should take into account provided sorting options', async () => {
//       const posts = await listAllPosts({
//         sortBy: 'updatedAt',
//         sortOrder: 'ascending',
//       })
//       const sortedSamplePosts = createdSamplePosts.sort(
//         (a, b) => a.updatedAt - b.updatedAt,
//       )
//       expect(posts.map((post) => post.updatedAt)).toEqual(
//         sortedSamplePosts.map((post) => post.updatedAt),
//       )
//     })

//     test('should be able to filter posts by author', async () => {
//       const posts = await listPostsByAuthor('Daniel Bugl')
//       console.log(createdSamplePosts[0].author)
//       expect(posts.length).toBe(3)
//     })

//     test('should be able to filter posts by tag', async () => {
//       const posts = await listPostsByTag('nodejs')
//       expect(posts.length).toBe(1)
//     })
//   })

//   describe('getting a post', () => {
//     test('should return the full post', async () => {
//       const post = await getPostById(createdSamplePosts[0]._id)
//       expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
//     })

//     test('should fail if the id does not exist', async () => {
//       const post = await getPostById('000000000000000000000000')
//       expect(post).toEqual(null)
//     })
//   })

//   describe('updating posts', () => {
//     test('should update the specified property', async () => {
//       await updatePost(userId, createdSamplePosts[0]._id, {
//         title: 'Test Author',
//       })
//       const updatedPost = await Post.findById(createdSamplePosts[0]._id)
//       expect(updatedPost.title).toEqual('Test Author')
//     })

//     test('should not update other properties', async () => {
//       await updatePost(userId, createdSamplePosts[0]._id, {
//         contents: 'Test Author',
//       })
//       const updatedPost = await Post.findById(createdSamplePosts[0]._id)
//       expect(updatedPost.title).toEqual('Learning Redux')
//     })

//     test('should update the updatedAt timestamp', async () => {
//       await updatePost(userId, createdSamplePosts[0]._id, {
//         title: 'Test Author',
//       })
//       const updatedPost = await Post.findById(createdSamplePosts[0]._id)
//       expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
//         createdSamplePosts[0].updatedAt.getTime(),
//       )
//     })

//     test('should fail if the id does not exist', async () => {
//       const post = await updatePost(userId, '000000000000000000000000', {
//         title: 'Test Author',
//       })
//       expect(post).toEqual(null)
//     })
//   })

//   describe('deleting posts', () => {
//     test('should remove the post from the database', async () => {
//       const result = await deletePost(userId, createdSamplePosts[0]._id)
//       expect(result.deletedCount).toEqual(1)
//       const deletedPost = await Post.findById(createdSamplePosts[0]._id)
//       expect(deletedPost).toEqual(null)
//     })

//     test('should fail if the id does not exist', async () => {
//       const result = await deletePost('000000000000000000000000')
//       expect(result.deletedCount).toEqual(0)
//     })
//   })
//     test('should fail if the id does not exist', async () => {
//     const result = await deletePost('000000000000000000000000')
//     expect(result.deletedCount).toEqual(0)
//   })
// })

import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { createTestUser } from '../test/helper.js'
import { Post } from '../db/models/post.js'

let userId
let createdSamplePosts = []

// Setup user and clear posts before each test
beforeAll(async () => {
  userId = await createTestUser()
})

beforeEach(async () => {
  await Post.deleteMany()
  createdSamplePosts = []

  const samplePosts = [
    {
      title: 'Learning Redux',
      contents: 'Redux content',
      tags: ['redux'],
      author: userId,
    },
    {
      title: 'Learn React Hooks',
      contents: 'React hooks content',
      tags: ['react'],
      author: userId,
    },
    {
      title: 'Full-Stack React Projects',
      contents: 'Full-stack content',
      tags: ['react', 'nodejs'],
      author: userId,
    },
  ]

  // Create sample posts in the database
  createdSamplePosts = await Post.insertMany(samplePosts)
})

describe('Post Operations', () => {
  describe('Creating Posts', () => {
    test('with all parameters should succeed', async () => {
      const post = {
        title: 'Hello Mongoose!',
        contents: 'This post is stored in a MongoDB database using Mongoose.',
        tags: ['mongoose', 'mongodb'],
      }
      const createdPost = await createPost(userId, post)
      expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
      const foundPost = await Post.findById(createdPost._id)
      expect(foundPost).toEqual(expect.objectContaining(post))
      expect(foundPost.createdAt).toBeInstanceOf(Date)
      expect(foundPost.updatedAt).toBeInstanceOf(Date)
    })

    test('without title should fail', async () => {
      const post = {
        contents: 'Post with no title',
        tags: ['empty'],
      }
      await expect(createPost(userId, post)).rejects.toThrow(
        mongoose.Error.ValidationError,
      )
    })

    test('with minimal parameters should succeed', async () => {
      const post = {
        title: 'Only a title',
      }
      const createdPost = await createPost(userId, post)
      expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    })
  })

  describe('Listing Posts', () => {
    test('should return all posts', async () => {
      const posts = await listAllPosts()
      expect(posts.length).toEqual(createdSamplePosts.length)
    })

    test('should return posts sorted by creation date descending by default', async () => {
      const posts = await listAllPosts()
      const sortedSamplePosts = [...createdSamplePosts].sort(
        (a, b) => b.createdAt - a.createdAt,
      )
      expect(posts.map((post) => post.createdAt)).toEqual(
        sortedSamplePosts.map((post) => post.createdAt),
      )
    })

    test('should filter posts by author', async () => {
      const posts = await listPostsByAuthor('Daniel Bugl')
      expect(posts.length).toBe(3)
    })

    test('should filter posts by tag', async () => {
      const posts = await listPostsByTag('nodejs')
      expect(posts.length).toBe(1)
    })
  })

  describe('Getting a Post', () => {
    test('should return the full post', async () => {
      const post = await getPostById(createdSamplePosts[0]._id)
      expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
    })

    test('should fail if the id does not exist', async () => {
      const post = await getPostById('000000000000000000000000')
      expect(post).toEqual(null)
    })
  })

  describe('Updating Posts', () => {
    test('should update the specified property', async () => {
      await updatePost(userId, createdSamplePosts[0]._id, {
        title: 'Test Author',
      })
      const updatedPost = await Post.findById(createdSamplePosts[0]._id)
      expect(updatedPost.title).toEqual('Test Author')
    })

    test('should not update other properties', async () => {
      await updatePost(userId, createdSamplePosts[0]._id, {
        contents: 'Test Author',
      })
      const updatedPost = await Post.findById(createdSamplePosts[0]._id)
      expect(updatedPost.title).toEqual('Learning Redux')
    })

    test('should update the updatedAt timestamp', async () => {
      await updatePost(userId, createdSamplePosts[0]._id, {
        title: 'Test Author',
      })
      const updatedPost = await Post.findById(createdSamplePosts[0]._id)
      expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
        createdSamplePosts[0].updatedAt.getTime(),
      )
    })

    test('should fail if the id does not exist', async () => {
      const post = await updatePost(userId, '000000000000000000000000', {
        title: 'Test Author',
      })
      expect(post).toEqual(null)
    })
  })

  describe('Deleting Posts', () => {
    test('should remove the post from the database', async () => {
      const result = await deletePost(userId, createdSamplePosts[0]._id)
      expect(result.deletedCount).toEqual(1)
      const deletedPost = await Post.findById(createdSamplePosts[0]._id)
      expect(deletedPost).toEqual(null)
    })

    test('should fail if the id does not exist', async () => {
      const result = await deletePost(userId, '000000000000000000000000')
      expect(result.deletedCount).toEqual(0)
    })
  })
})
