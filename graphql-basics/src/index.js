import { GraphQLServer } from 'graphql-yoga'

const users = [
	{
		id: '1',
		name: 'Andrew',
		email: 'andrew@test.com',
		age: 27,
	},
	{
		id: '2',
		name: 'Sarah',
		email: 'sarah@test.com',
	},
	{
		id: '3',
		name: 'Mike',
		email: 'mike@test.com',
		age: 36,
	},
]

const posts = [
	{
		id: '11',
		title: 'My first Post',
		body: 'this is my first post using graphql',
		published: true,
		author: '1',
	},
	{
		id: '21',
		title: 'My Secong Post',
		body: 'this is my second post using graphql',
		published: false,
		author: '1',
	},
	{
		id: '31',
		title: 'My third Post',
		body: 'this is my third post using graphql',
		published: true,
		author: '2',
	},
]

const comments = [
	{
		id: '111',
		text: 'First comment',
		author: '1',
	},
	{
		id: '222',
		text: 'second comment',
		author: '1',
	},
	{
		id: '333',
		text: 'Third comment',
		author: '2',
	},
	{
		id: '444',
		text: 'Fourth comment',
		author: '3',
	},
]

// Type definitions (schema)
const typeDefs = `
    type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		me: User!
		post: Post!
		comments: [Comment!]!
	}
	
	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!

	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
	}

	type Comment {
		id: ID!
		text: String!
		author: User!
	}
`

// Resolvers
const resolvers = {
	Query: {
		users(parent, args, ctx, info) {
			if (!args.query) {
				return users
			}
			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase())
			})
		},
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts
			}
			return posts.filter((post) => {
				return post.title.toLowerCase().includes(args.query.toLowerCase())
			})
		},
		me() {
			return {
				id: '123098',
				name: 'Ademola',
				email: 'dem@test.com',
				age: 28,
			}
		},
		comments(parent, args, ctx, info) {
			return comments
		},
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id
			})
		},
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
	},
}

const server = new GraphQLServer({
	typeDefs,
	resolvers,
})

server.start(() => {
	console.log('The Server is running')
})
