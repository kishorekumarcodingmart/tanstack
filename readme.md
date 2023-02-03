1. Wrap QueryClientProvider With Apllication and pass client props

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import App from './App'


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

2. UseQuery => Fetch Data 

```javascript
import React from 'react'
import {useQuery, useMutation} from '@tanstack/react-query'


const POSTS = [
    {id : 1, title : "Post 1"},
    {id : 2, title : "Post 2"}
]


// Fetch call
function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}


function UseQuery() {

    const postQuery = useQuery({
        queryKey : ["post"], // -> unique identifier
        queryFn : () => wait(5000).then(() => [...POSTS]), // -> function to get data
        // queryFn : () => Promise.reject("Error Message") 
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
    </div>

}

export default UseQuery
```

3. UseMutation => Create Data

```javascript

const queryClient = useQueryClient()


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

<button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("New Post")}>Add Post</button>

```