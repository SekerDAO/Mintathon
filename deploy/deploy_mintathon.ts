import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  await deploy("Mintathon001", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });
};

deploy.tags = ["mintahon001"];
export default deploy;
