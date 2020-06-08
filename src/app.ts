import express, {Request, Response} from 'express';
import cors from 'cors';

import  { uuid } from 'uuidv4'

const app = express()

app.use(cors())

app.use(express.json())


interface Project {
    id: string,
    title: string,
    url: string,
    techs: string[],
    likes: number,
}

interface Liked {
    id: number,
    repository_id: number,
    user: string,
}

const repositories: Array<Project> = [];
const liked: Array<Liked> = [];


  app.get("/repositories", (request: Request, response: Response) => {

    return response.json(repositories)
  
    });
  
  app.post("/repositories", (request: Request, response: Response) => {

    const {

        title,
        url,
        techs,

    } = request.body

    const parsedTechs = String(techs)
        .split(',')
        .map(tech => String(tech.trim()))

    const id = uuid()
    
    const project = {
        id,
        title,
        url,
        techs: parsedTechs,
        likes: 0,
    }

    repositories.push(project)

    return response.json(project)

     });
  
  app.put("/repositories/:id",  (request: Request, response: Response) => {
    
    const { id } = request.params

    const projectIndex = repositories.findIndex(project => project.id === id)
    
    const { title , url, techs } = request.body

    if(projectIndex < 0) {

        return response.status(400).json({ error: 'Project not found.'});

      }
    
      const parsedTechs = String(techs)
      .split(',')
      .map(tech => String(tech.trim()))
    
      const project = {
          id: id,
          title,
          url,
          techs: parsedTechs,
          likes: repositories[projectIndex].likes,    
      };
    
      repositories[Number(id)] = project
      
      return response.json(project)
    
     });
  
  app.delete("/repositories/:id", (request: Request, response: Response) => {

    const { id } = request.params

    const projectIndex = repositories.findIndex(project => project.id === id)
    
    if(projectIndex < 0) {

        return response.status(400).json({ error: 'Project not found.'});

    }
    
      repositories.splice(projectIndex, 1);

      return response.status(204).send();

    });
  
  app.post("/repositories/:id/like", (request: Request, response: Response) => {
    
    const { id } = request.params; 
    const { user } = request.body;
  
    const projectIndex = repositories.findIndex(project => project.id === id)
    
    if(projectIndex < 0) {

        return response.status(400).json({ error: 'Project not found.'});

    }

    const projectUser = String(user)
      
    const like = { 
        id: Number(uuid()), 
        repository_id: Number(id),
        user: projectUser,
    };

    liked.push(like)

   
    });
  

export default app
