import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as pretService from '@components/pret/pret.service';
import { IPret } from '@components/pret/pret.interface';


const createPret = async (req: Request, res: Response) => {
  try {
    const pret = req.body as IPret;
    const result = await pretService.create(pret);
    res.status(result.status);
    if (result.pret) {
      return res.send({ message: result.message, pret: result.pret });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readPret = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK);
    const result = await pretService.read( req.params.id );
    res.status(result.status);
    if (result.pret) {
      return res.send({ message: result.message, pret: result.pret });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }

};

const updatePret = async (req: Request, res: Response) => {
  try {
    const pret: IPret = { id: req.params.id, ...req.body };
    const result = await pretService.update(pret);
    res.status(result.status);
    if (result.pret) {
      return res.send({ message: result.message, pret });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const deletePret = async (req: Request, res: Response) => {
  try {
    const result = await pretService.deleteById(
      req.params.id,
    );
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const listPret = async (req: Request, res: Response) => {
  try {
    const { searchWord } = req.query; // Extracting searchParams from query
    const result = await pretService.getListPret(
      searchWord,
    );
    res.status(result.status);
    if (result.listPret) {
      return res.send({ message: result.message, prets: result.listPret });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const getListPretByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await pretService.getListPretByUserId(
      userId,
    );
    res.status(result.status);
    if (result.listPret) {
      return res.send({ message: result.message, prets: result.listPret });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const getListEchances = async (req: Request, res: Response) => {
  try {
    const result = await pretService.getListEchances();
    res.status(result.status);
    if (result.listEchances) {
      return res.send({ message: result.message, prets: result.listEchances });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const getListEchancesByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pretService.getListEchancesByUserId(req.params.userId);
    res.status(result.status);
    if (result.listEchances) {
      return res.send({ message: result.message, prets: result.listEchances });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const generatePretPDF = async (req: Request, res: Response) => {
  try {
    const result = await pretService.generatePretPDF(req.params.pretId);
    res.status(result.status);
    if (result.filePath) {
      return res.send({ message: result.message, filename: result.filePath });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

export {
  createPret,
  readPret,
  updatePret,
  deletePret,
  listPret,
  getListPretByUserId,
  getListEchances,
  getListEchancesByUserId,
  generatePretPDF,
};
