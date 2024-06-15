import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Member } from "../../entity/Member.entity";
import { Mentor } from "../../entity/Mentor.entity";

export class MemberController {
  static async get(req: Request, res: Response) {
    try {
      const memberRepository = AppDataSource.getRepository(Member);
      const members = await memberRepository.find({
        relations: ["mentor"]
      });
      return res.status(200).json(members);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getDetails(req: Request, res: Response) {
    try {
      const memberRepository = AppDataSource.getRepository(Member);
      const member = await memberRepository.findOneBy({id: req.params.id})
      if(!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      return res.status(200).json(member);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  static async post(req: Request, res: Response) {
    try {
      const {name, departement, year} = req.body
      const memberRepository = AppDataSource.getRepository(Member);
      const mentorRepository = AppDataSource.getRepository(Mentor);

      const mentorsList = await mentorRepository.createQueryBuilder("mentors")
        .select(["mentors.id", "count(*)"])
        .leftJoin("mentors.members", "members")
        .groupBy("mentors.id")
        .orderBy("count(*)", "ASC")
        .limit(1)
        .getMany()

      const members = await memberRepository.save({name, departement, year, mentor: mentorsList[0]});
      console.log(members)
      
      return res.status(200).json(members);
    } catch (error) {
      console.error(`Error: ${error}`);

      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const memberRepository = AppDataSource.getRepository(Member);
      const member = await memberRepository.findOneBy({id: req.params.id})
      if(!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const updatedMember = await memberRepository.save({...member, ...req.body})
      console.log(updatedMember)
      return res.status(200).json(updatedMember)
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /* The Logic: 
  * 1. We must check, if the mentor's total member is not less than minMember mentor, dont swipte
  * 2. If the mentor's total member is less than minMember mentor, check:
  *   - if maxMember mentor - minMember mentor = 0, don't swipe member
  *   - if maxMember mentor - minMember mentor > 0, we can swipe member from maxMember mentor
  * 3. else, dont swipe member
  */
  static async delete(req: Request, res: Response) {
    try {
      const memberRepository = AppDataSource.getRepository(Member);
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const member = await memberRepository.find({
        where: {
          id: req.params.id
        },
        relations: ["mentor"]
      })
      if(member.length === 0) {
        return res.status(404).json({ message: "Member not found" });
      }

      const getMentorId = member[0].mentor?.id

      await memberRepository.remove(member[0]);

      const mentorListWithTotalMember = await AppDataSource.manager.query(`
        SELECT "mentor"."id" AS "mentor_id", count(*) as totalMembers 
        FROM "mentors" "mentor" 
        INNER JOIN "members" "members" ON "members"."mentorId" = "mentor"."id" 
        GROUP BY "mentor"."id" 
        ORDER BY totalMembers DESC
      `)

      const getMentor = await mentorRepository.find({
        where: {
          id: getMentorId
        },
        relations: ["members"]
      })

      const getMentorTotalMember = getMentor[0].members.length
      const getMentorMinMember = mentorListWithTotalMember[mentorListWithTotalMember-1].totalmembers
      const getMentorMaxMember = mentorListWithTotalMember[0].totalmembers

      // #1
      if(getMentorTotalMember >= getMentorMinMember) {
        return res.status(200).json({ message: "Member deleted successfully (#1)" });
      } else {
        // #2
        if(getMentorMaxMember - getMentorMinMember === 0) {
          return res.status(200).json({ message: "Member deleted successfully (#2)" });
        } else {
          // #3
          const getMaxMemberMentor = await mentorRepository.find({
            where: {
              id: mentorListWithTotalMember[0].mentor_id
            },
            relations: ["members"]
          })

          const getOneOfMember = getMaxMemberMentor[0].members[0]

          const editMember = (await memberRepository.update(getOneOfMember.id, {mentor: getMentor[0]})).raw[0]
          console.log("MEMBERCONTROLLER: editMember= ", editMember)
          return res.status(200).json({ message: "Member deleted successfully (#3)" });
        }
      }

      // return res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}