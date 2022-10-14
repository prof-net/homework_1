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

enum enumAvailableResolutions {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P144",
    P720 = "P480",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}

interface IError {
    message: string;
    field: string;
}

let videos: IVideo[] = [];

const errorMessage = (err: Array<IError>) => {
    return {
        errorsMessages: [
            ...err
        ]
    }
}

function addDays(date:Date, days: number) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

function isIsoDate(str:string) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    // @ts-ignore
    return d instanceof Date && !isNaN(d) && d.toISOString()===str; // valid date
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

    const err:IError[] = [];

    if (!req.body.title) {
        err.push({
            message: "Title can't by empty",
            field: "title"
        });
    }

    if (req.body.title && req.body.title.length > 40) {
        err.push({
            message: "Title can't by more than 40 characters",
            field: "title"
        });
    }

    if (!req.body.author) {
        err.push({
            message: "Author can't by empty",
            field: "author"
        });
    }

    if (req.body.author && req.body.author.length > 20) {
        err.push({
            message: "Author can't by more than 20 characters",
            field: "author"
        });
    }

    if (req.body.availableResolutions.filter((item: enumAvailableResolutions) => Object.values(enumAvailableResolutions).includes(item)).length === 0) {
        err.push({
            message: "AvailableResolutions can't by Invalid",
            field: "availableResolutions"
        });
    }

    if (err.length === 0) {
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
    } else {
        res.status(400).send(errorMessage(err));
    }
});

//update single videos
videoRouter.put('/videos/:id', (req: Request, res: Response) => {
    const err:IError[] = [];
    const id: number = +req.params.id;
    if (!videos.find(item => item.id === id)) {
        res.send(404);
    }

    if (!req.body.title) {
        err.push({
            message: "Title can't by empty",
            field: "title"
        });
    }

    if (!req.body.author) {
        err.push({
            message: "Author can't by empty",
            field: "author"
        });
    }

    if (req.body.author && req.body.author.length > 20) {
        err.push({
            message: "Author can't by more than 40 characters",
            field: "author"
        });
    }

    if (req.body.title && req.body.title.length > 40) {
        err.push({
            message: "Title can't by more than 20 characters",
            field: "title"
        });
    }

    if (req.body.minAgeRestriction && +req.body.minAgeRestriction > 18) {
        err.push({
            message: "MinAgeRestriction can't by more than 18",
            field: "minAgeRestriction"
        });

    }
    if (req.body.minAgeRestriction && +req.body.minAgeRestriction < 0) {
        err.push({
            message: "MinAgeRestriction can't by less than 0",
            field: "minAgeRestriction"
        });
    }

    if (req.body.availableResolutions.filter((item: enumAvailableResolutions) => Object.values(enumAvailableResolutions).includes(item)).length === 0) {
        err.push({
            message: "AvailableResolutions can't by Invalid",
            field: "availableResolutions"
        });
    }

    if (typeof req.body.canBeDownloaded !== "boolean") {
        err.push({
            message: "canBeDownloaded can be only boolean",
            field: "canBeDownloaded"
        });
    }

    if (!isIsoDate(req.body.publicationDate)) {
        err.push({
            message: "publicationDate can be only date",
            field: "publicationDate"
        });
    }

    if (err.length === 0) {
        videos = videos.map(item => {
            if (item.id === +req.params.id) {
                return {
                    id: +req.params.id,
                    title: req.body.title,
                    author: req.body.author,
                    minAgeRestriction: req.body.minAgeRestriction,
                    createdAt: req.body.createdAt ? req.body.createdAt : item.createdAt,
                    publicationDate: req.body.publicationDate ? req.body.publicationDate : item.publicationDate,
                    canBeDownloaded: req.body.canBeDownloaded ? true : false,
                    availableResolutions: [...new Set([...item.availableResolutions, ...req.body.availableResolutions])]
                }
            }
            return item;

        });
        res.send(204);
    } else {
        res.status(400).send(errorMessage(err));
    }
});

//Get all videos
videoRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    res.status(204).send("All data is deleted");
});

