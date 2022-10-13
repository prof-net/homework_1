import {Request, Response, Router} from "express";

export const videoRouter = Router({});

interface IVideo {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean | null,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Array<string>
}

let videos: IVideo[] = [];

const errorMessage = (message: string, field: string) => {
    return {
        errorsMessages: [
            {
                message: message,
                field: field
            }
        ]
    }
}

function addDays(date:Date, days: number) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

//Get all videos
videoRouter.get('/videos', (req: Request, res: Response) => {
    res.send(videos);
});

//Get single videos
videoRouter.get('/videos/:id', (req: Request, res: Response) => {
    const video = videos.find(item => item.id === +req.params.id);
    if (video) {
        res.send(video);
    } else {
        res.send(404);
    }
});

//delete single videos
videoRouter.delete('/videos/:id', (req: Request, res: Response) => {
    const isDelVideo = videos.find(item => item.id === +req.params.id);
    if (isDelVideo) {
        videos = videos.filter(item => item.id !== +req.params.id);
        res.send(204);
    } else {
        res.send(404);
    }
});

//create single videos
videoRouter.post('/videos', (req: Request, res: Response) => {
    if (!req.body.title) {
        res.status(400).send(errorMessage("Title can't by empty", "title"));
    }
    else if (req.body.title.length > 40) {
        res.status(400).send(errorMessage("Title can't by more than 40 characters", "title"));
    }
    else if (!req.body.author) {
        res.status(400).send(errorMessage("Author can't by empty", "author"));
    }
    else if (req.body.author.length > 20) {
        res.status(400).send(errorMessage("Author can't by more than 20 characters", "author"));
    }
    else {
        const newVideo: IVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: addDays(new Date(), 1).toISOString(),
            availableResolutions: req.body.availableResolutions
        }
        videos.push(newVideo);
        res.status(201).send(newVideo);
    }
});

//update single videos
videoRouter.put('/videos/:id', (req: Request, res: Response) => {
    const id: number = +req.params.id;
    if (!videos.find(item => item.id === id)) {
        res.send(404);
    }
    else if (!req.body.title) {
        res.status(400).send(errorMessage("Title can't by empty", "title"));
    }
    else if (!req.body.author) {
        res.status(400).send(errorMessage("Author can't by empty", "author"));
    }
    else if (req.body.author.length > 20) {
        res.status(400).send(errorMessage("Author can't by more than 40 characters", "author"));
    }
    else if (req.body.title.length > 40) {
        res.status(400).send(errorMessage("Title can't by more than 20 characters", "title"));
    }
    if (req.body.minAgeRestriction && +req.body.minAgeRestriction > 18) {
        res.status(400).send(errorMessage("MinAgeRestriction can't by more than 18", "minAgeRestriction"));
    }
    if (req.body.minAgeRestriction && +req.body.minAgeRestriction < 0) {
        res.status(400).send(errorMessage("MinAgeRestriction can't by less than 0", "minAgeRestriction"));
    }
    else {
        videos.map(item => {
            return {
                ...item,
                ...req.body,
                canBeDownloaded: req.body.canBeDownloaded ? true : false
            }
        });
        res.send(204);
    }
});

//Get all videos
videoRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    res.status(204).send("All data is deleted");
});

