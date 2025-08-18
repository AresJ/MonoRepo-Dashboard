import { Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "../middleware/auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { ClaimStatus, UserRole, Prisma } from "../generated/prisma";

const claimsRouter = Router();

// Validation Schemas
const createClaimSchema = z.object({
    policyId: z.string().uuid(),
    propertyId: z.string().uuid(),
    description: z.string().min(10),
    amount: z.number().positive(),
    incidentDate: z.coerce.date(),
});
const getClaimsSchema = z.object({
    policyId: z.string().uuid().optional(),
    status: z.nativeEnum(ClaimStatus).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(20),
});

//Get all claims
claimsRouter.get("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const user = req.user!;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const whereClause: Prisma.ClaimWhereInput = {};
        if(user.role !== UserRole.ADJUSTER && user.role !== UserRole.ADMIN){
            whereClause.userId = user.userId;
        }

        const claims = await prisma.claim.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                policy: {
                    select: {
                        policyNumber: true,
                        id: true
                    }
                },
                property: {
                    select: {
                        id: true,
                        address: true,
                        type: true,
                    }
                }, 
                adjuster: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        res.status(200).json({
            data:claims,
            limit,
            total: claims.length,
            pages: Math.ceil(claims.length / limit),
        });
    } catch (error) {
        console.error("Error fetching claims:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Get a single claim
claimsRouter.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => { 
    try{
        const user = req.user!;
        const id = req.params.id;

        const {policyId, status, page, limit} = getClaimsSchema.parse(req.query);
        const whereClause: Prisma.ClaimWhereInput = {};
        if(user.role !== UserRole.ADJUSTER && user.role !== UserRole.ADMIN){
            whereClause.userId = user.userId;
        }

        const skip = (page - 1) * limit;
        const take = limit;

        if(policyId) whereClause.policyId = policyId;
        if(status) whereClause.status = status;
        

        const claim = await prisma.claim.findMany({
            where: {id, ...whereClause}, include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                policy: {
                    select: {
                        policyNumber: true,
                        id: true
                    }
                },
                property: {
                    select: {
                        id: true,
                        address: true,
                        type: true,
                    }
                },
                adjuster: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            skip: skip as unknown as number,
            take: take as unknown as number,
        }); 

        if(!claim || claim.length === 0) {
            return res.status(404).json({error: "Claim not found"});
        }

        res.status(200).json(claim[0]);
    } catch (error) {
        console.error("Error fetching claim:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

//POST /api/claims - Create a new claim
claimsRouter.post("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const Validation = createClaimSchema.safeParse(req.body);
        if(!Validation.success){
            return res.status(400).json({error: "Invalid request body", details: Validation.error.message});
        }
        const {policyId, propertyId, description, amount, incidentDate} = Validation.data;

        //Generate claim number
        const claimCount = await prisma.claim.count({where: {policyId}});
        const claimNumber = `CLM-${policyId}-${claimCount + 1}`;

        const newClaim = await prisma.claim.create({
            data: {
                claimNumber,
                policyId,
                propertyId,
                description,
                amount,
                incidentDate: new Date(incidentDate),
                userId: req.user!.userId,
                status: ClaimStatus.DRAFT,
            },
            include: {
                policy: {
                    select: {
                        policyNumber: true,
                        id: true,
                    }
                },
                property: {
                    select: {
                        id: true,
                        address: true,
                        type: true,
                    }
                },
                adjuster: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        res.status(201).json(newClaim);
    } catch (error) {
        console.error("Error creating claim:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

export default claimsRouter;