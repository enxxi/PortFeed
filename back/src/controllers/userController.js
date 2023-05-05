import is from "@sindresorhus/is";
import { userAuthService } from "../services/userService";
import { UserModel } from "../db/schemas/user";
const logger = require("../config/logger");
class userController {
  static async userPostFunction(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // req (request) 에서 데이터 가져오기
      const { name, email, password } = await req.body;

      // 위 데이터를 유저 db에 추가하기
      const newUser = await userAuthService.addUser({
        name,
        email,
        password,
      });

      if (newUser.errorMessage) {
        throw new Error(newUser.errorMessage);
      }

      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async userLoginFunction(req, res, next) {
    logger.info(`POST /user/register 200 "회원가입 완료"`);
    try {
      // req (request) 에서 데이터 가져오기
      const email = req.body.email;
      const password = req.body.password;

      // 위 데이터를 이용하여 유저 db에서 유저 찾기
      const user = await userAuthService.getUser({ email, password });

      if (user.errorMessage) {
        throw new Error(user.errorMessage);
      }

      return res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  static async userGetListFunction(req, res, next) {
    logger.info(`Get /user/userlist 200 "네트워크로 이동"`);
    try {
      // 전체 사용자 목록을 얻음
      const page = Number(req.query.page) ?? 1;
      const perPage = parseInt(req.query.perPage);
      const [total, posts] = await Promise.all([
        UserModel.countDocuments({}),
        UserModel.find({})
          .sort({ createdAt: 1 })
          .skip(perPage * (page - 1))
          .limit(perPage), //sort,skip,limit 사용
      ]);

      const totalPage = Math.ceil(total / perPage);

      return res.status(200).json({ posts, page, perPage, totalPage });
    } catch (error) {
      next(error);
    }
  }

  static async userGetCurrentFunction(req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const user_id = req.currentUserId;
      const currentUserInfo = await userAuthService.getUserInfo({
        user_id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      return res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }

  static async userPutFunction(req, res, next) {
    try {
      // URI로부터 사용자 id를 추출함.
      const user_id = req.params.id;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const name = req.body.name ?? null;
      const email = req.body.email ?? null;
      const password = req.body.password ?? null;
      const description = req.body.description ?? null;

      const toUpdate = { name, email, password, description };

      // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
      const updatedUser = await userAuthService.setUser({ user_id, toUpdate });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async userGetInfoFunction(req, res, next) {
    logger.info(`GET /user/current 200 "나의 페이지로 이동"`);
    try {
      const user_id = req.params.id;
      const currentUserInfo = await userAuthService.getUserInfo({ user_id });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      return res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }

  static async userPatchProfileFunction(req, res, next) {
    try {
      // URI로부터 사용자 id를 추출함.
      const user_id = req.params.id;

      const profile = req.file ? req.file.filename : null;

      const toUpdate = { profile };

      // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
      const updatedUser = await userAuthService.setUser({ user_id, toUpdate });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
export { userController };
