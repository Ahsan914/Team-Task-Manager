

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const teamSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
            trim: true,
		},

        description: {
			type: String,
            trim: true,
			default: "",
		},

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: "User",
        },
        
		members: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		}
	},
	{timestamps: true}
);

const taskSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
            trim: true,
		},

		description: {
			type: String,
            trim: true,
			default: "",
		},

        team: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Team",
        },

        assignedTo: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        
        status: {
            type: String,
            default: "todo",
        },
        
		dueDate: {
			type: Date,
			default: null,
		}
	},
	{timestamps: true}
);

const User = mongoose.model("User", userSchema);
const Team = mongoose.model("Team", teamSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Team, Task };



