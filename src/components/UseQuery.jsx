import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


const POSTS = [
    {id : 1, title : "Post 1"},
    {id : 2, title : "Post 2"}
]


// Fetch call
function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}


function UseQuery() {

    const queryClient = useQueryClient()

    const postQuery = useQuery({
        queryKey : ["post"], // -> unique identifier
        queryFn : () => wait(5000).then(() => [...POSTS]), // -> function to get data
        // queryFn : () => Promise.reject("Error Message") 
    })

    const newPostMutation = useMutation({
        mutationFn : (title) => {
            return wait(3000).then(() => {
                POSTS.push({id : Math.round(Math.random() * 100), title : title})
            })
        },
        onSuccess : () => {
            queryClient.invalidateQueries(["post"])
        }
        
    })

    if(postQuery.isLoading) {
        return <h1>Loading...</h1>
    }

    if(postQuery.isError) {
        return <pre>{JSON.stringify(postQuery.error)}</pre>
    }

    return <div>
        {
            postQuery.data.map((post) => {
                return <h3 key={post.id}>{post.title}</h3>
            } )
        }
        <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("New Post")}>Add Post</button>
    </div>

}

export default UseQuery