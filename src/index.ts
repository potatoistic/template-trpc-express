import { app } from './server'
import { environment } from './config/environment'

app.listen(environment.SERVER_PORT, () => {
  console.log(
    '🚀 Server is up and running on port ' + String(environment.SERVER_PORT)
  )
})
