import { Router } from "express";
import { AuthenticatedRequest, authenticateToken } from "../middleware/auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { PropertyType, PolicyStatus, UserRole, Prisma } from "../generated/prisma";

const policiesRouter = Router();

//Validation Schemas
const createPolicySchema = z.object({
    type: z.nativeEnum(PropertyType),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    premium: z.number().positive(),
    coverageAmount: z.number().positive(),
    deductible: z.number().positive(),
    propertyId: z.string().uuid(),
});

const getPoliciesSchema = z.object({
    status: z.nativeEnum(PolicyStatus).optional(),
    type: z.nativeEnum(PropertyType).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(20),
});

const updatePolicySchema = z.object({
    type: z.nativeEnum(PropertyType).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    premium: z.number().positive().optional(),
    coverageAmount: z.number().positive().optional(),
    deductible: z.number().positive().optional(),
    status: z.nativeEnum(PolicyStatus).optional(),
});

//GET /api/policies - Get all policies
policiesRouter.get("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const user = req.user!;
        const {status, type, page, limit} = getPoliciesSchema.parse(req.query);

        const skip = (page - 1) * limit;
        const take = limit;

        const whereClause: Prisma.PolicyWhereInput = {};

        // Role-based access control
        if(user.role !== UserRole.ADMIN && user.role !== UserRole.ADJUSTER && user.role !== UserRole.AGENT){
            whereClause.userId = user.userId;
        }

        // Filter by status
        if(status) whereClause.status = status;
        // Filter by property type
        if(type) whereClause.type = type;

        const policies = await prisma.policy.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                properties: true,
                _count: {
                    select: {
                        claims: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take,
        });

        res.status(200).json({
            data: policies,
            limit,
            total: policies.length,
            pages: Math.ceil(policies.length / limit),
        });
    } catch (error) {
        console.error("Error fetching policies:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

//POST /api/policies - Create a new policy
policiesRouter.post("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const validation = createPolicySchema.safeParse(req.body);
        if(!validation.success){
            return res.status(400).json({error: "Invalid request body", details: validation.error.message});
        }

        const {type, startDate, endDate, premium, coverageAmount, deductible} = validation.data;

        //Generate policy number
        const policyCount = await prisma.policy.count({where: {userId: req.user!.userId}});
        const policyNumber = `POL-${req.user!.userId}-${policyCount + 1}`;

        const newPolicy = await prisma.policy.create({
            data: {
                policyNumber,
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                premium,
                coverageAmount,
                deductible,
                status: PolicyStatus.ACTIVE,
                userId: req.user!.userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                properties: true,
                _count: {
                    select: {
                        claims: true,
                    }
                }
            }
        });

        res.status(201).json(newPolicy);
    } catch (error) {
        console.error("Error creating policy:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

//GET /api/policies/:id - Get a single policy
policiesRouter.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const user = req.user!;
        const id = req.params.id;

        const policy = await prisma.policy.findUnique({
            where: {id},
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                properties: true,
                _count: {
                    select: {
                        claims: true,
                    }
                }
            }
        });

        if(!policy) {
            return res.status(404).json({error: "Policy not found"});
        }

        // Role-based access control
        if(policy.userId !== user.userId && user.role !== UserRole.ADMIN){
            return res.status(403).json({error: "Unauthorized to view this policy"});
        }

        res.status(200).json(policy);
    } catch (error) {
        console.error("Error fetching policy:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

//PUT /api/policies/:id - Update a policy
policiesRouter.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const id = req.params.id;
        const validation = updatePolicySchema.safeParse(req.body);
        if(!validation.success){
            return res.status(400).json({error: "Invalid request body", details: validation.error.message});
        }
        const updateData = validation.data;

        //Check if policy exists
        const policy = await prisma.policy.findUnique({
            where: {id},
            select: { userId: true }
        });

        if(!policy){
            return res.status(404).json({error: "Policy not found"});
        }

        if(policy.userId !== req.user!.userId && req.user!.role !== UserRole.ADMIN){
            return res.status(403).json({error: "Unauthorized to update this policy"});
        }

        //Convert date strings to Date objects if provided
        if(updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if(updateData.endDate) updateData.endDate = new Date(updateData.endDate);

        //Update policy
        const updatedPolicy = await prisma.policy.update({
            where: {id},
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                properties: true,
                _count: {
                    select: {
                        claims: true,
                    }
                }
            }
        });

        res.status(200).json(updatedPolicy);
    } catch (error) {
        console.error("Error updating policy:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

export default policiesRouter;