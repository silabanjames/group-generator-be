import { Request, Response, query } from "express";
import { AppDataSource } from "../../data-source";
import { Mentor } from "../../entity/Mentor.entity";
import { Member } from "../../entity/Member.entity";
import { EntityManager, Not } from "typeorm";


export class MentorController {
  static async get(req: Request, res: Response) {
    try {
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const mentors = await mentorRepository.find({
        relations: ['members']
      });
      return res.status(200).json(mentors);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getDetails(req: Request, res: Response) {
    try {
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const mentor = await mentorRepository.findOneBy({id: req.params.id})
      if(!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      return res.status(200).json(mentor);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /*
  * The Logic:
  * a = total member
  * b = total mentor
  *
  * - we must check, if a / b <= 1, we dont swipe member
  * - if a / b > 1, do another check
  *     - if (a % b >= 0)  &&  (a % b < minMembers), swiped members for minMember-1,
  *     - if (a % b > 0) && (a % b > minMembers), swiped members for minMember
  * - else, just return mentor
  */
  static async post(req: Request, res: Response) {
    try {
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const memberRepository = AppDataSource.getRepository(Member);

      const newMentor = await mentorRepository.save({...req.body});

      /*
      *  We need to search minimum member from mentor (using count)
      *  After that, we take member from other mentor one by one after new mentor react the minimum of the member
      */

      const mentorList = await mentorRepository.find({
        where: {
          id: Not(newMentor.id),
        },
        select: ["id"],
      })

      const memberList = await memberRepository.find({
        select: ["id"]
      })

      console.log("MENTROCONTROLLER: mentorList = ", mentorList)
      console.log("MENTORCONTROLLER: memberList = ", memberList)

      // #1
      if(memberList.length === 0) {
        return res.status(200).json({message: "Mentor created (#1)", newMentor});
      }
      // #2
      if(mentorList.length === 0) {
        for (const member of memberList) {
          member.mentor = newMentor
          await memberRepository.save(member)
        }
        return res.status(200).json({message: "Mentor created (#2)", newMentor});
      }

      // #3
      if(memberList.length / mentorList.length < 1) {
        return res.status(200).json({message: "Mentor created (#3)", newMentor});
      }

      // #4
      if(memberList.length / mentorList.length >= 1) {
        const mentorListWithTotalMember = await AppDataSource.manager.query(`
        SELECT "mentor"."id" AS "mentor_id", count(*) as totalMembers 
        FROM "mentors" "mentor" 
        INNER JOIN "members" "members" ON "members"."mentorId" = "mentor"."id" 
        GROUP BY "mentor"."id" 
        ORDER BY totalMembers DESC
        `)
        console.log("MENTORCONTROLLER: mentorListWithTotalMember = " , mentorListWithTotalMember)

        let addedMember = 0
        if(memberList.length % mentorList.length < mentorListWithTotalMember[mentorListWithTotalMember.length - 1].totalmembers) {
          addedMember = mentorListWithTotalMember[mentorListWithTotalMember.length - 1].totalmembers - 1
        }

        if(memberList.length % mentorList.length >= mentorListWithTotalMember[mentorListWithTotalMember.length - 1].totalmembers) {
          addedMember = mentorListWithTotalMember[mentorListWithTotalMember.length - 1].totalmembers
        }

        console.log("Least Members Mentor = ", mentorListWithTotalMember[mentorListWithTotalMember.length - 1].totalmembers)
        console.log("MENTORCONTROLLER: addedMember = " , addedMember)

        for (let i = 0; i < addedMember; i++) {
          let indexMentor = i % memberList.length
          const mentor_id = mentorListWithTotalMember[indexMentor].mentor_id
          const getMentor = await mentorRepository.find({
            where: {
              id: mentor_id
            },
            relations: ["members"]
          })
          const memberWillBeChanged = getMentor[0].members[0]

          memberWillBeChanged.mentor = newMentor
          await memberRepository.save(memberWillBeChanged)
        }

        return res.status(200).json({message: "Mentor created (#4)", newMentor});

      }

      // #5
      return res.status(200).json({message: "Mentor created (#5 | Default)", newMentor});

    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const mentor = await mentorRepository.findOneBy({id: req.params.id})
      if(!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      const updatedMentor = await mentorRepository.save({...mentor, ...req.body})
      console.log(updatedMentor)
      return res.status(200).json(updatedMentor)
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const memberRepository = AppDataSource.getRepository(Member);
      const mentor = await mentorRepository.findOne({
        where: {id: req.params.id}, 
        relations: ["members"]
      })
      if(!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      /*
      * Before remove mentor, we assignn correlated member to another mentor
      */
      if(mentor.members.length > 0) {
        const mentorList = await mentorRepository.find({
          where: {
            id: Not(mentor.id),
          },
          select: ["id"],
        })

        console.log("MENTORCONTROLLER: mentorList= ", mentorList)

        for (const [index, member] of mentor.members.entries()) {
          console.log("Index = ", member.id)
          const post = (await memberRepository.update(member.id, {mentor: (mentorList.length !== 0) ? mentorList[index % mentorList.length] : null})).raw[0]
          console.log(post)
        }
      }
      const deletedMentor = await mentorRepository.remove(mentor)
      return res.status(200).json({ message: "Mentor deleted successfully" })
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}