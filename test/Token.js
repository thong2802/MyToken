const {expect} = require('chai');
const { ethers } = require('hardhat');

describe('Token Contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
    Token = await ethers.getContractFactory('Token');
    token = await Token.deploy();
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  describe('Deployment', () => {
    it('Should set the right owner', async () => {
        expect(await token.owner()).to.equal(owner.address);
    });   
    it('should assign the total supply of tokens to thw owner', async () => {
        const ownerBalancer = await token.belanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalancer);
    });
  });
  describe('Transaction', () => {
    it('Should tranfer between acounts', async() => {
        await token.transfer(addr1.address, 50);
        const add1Balances = await token.belanceOf(addr1.address);
        expect(add1Balances).to.equal(50);

        await token.connect(addr1).transfer(addr2.address, 50);
        const add2Balances = await token.belanceOf(addr2.address);
        expect(add2Balances).to.equal(50);
    });
    it('Should fail if sender doesnt enough token', async() => {
        const initialBalancesOwner = await token.belanceOf(owner.address);
        await expect(
            token
                .connect(addr1)
                .transfer(owner.address, 1)
        )
            .to
            .be
            .revertedWith('Not enought tokens');

            expect(
                await token.belanceOf(owner.address)
            )
            .to
            .equal(initialBalancesOwner)
    });
    it('Should update balance after tranfer', async() => {
        const initialOwnerBalances = await token.belanceOf(owner.address);

        await token.transfer(addr1.address, 100);
        await token.transfer(addr2.address, 50);

        const finalOwnerBalance = await token.belanceOf(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalances - 150);

        const addr1Balance = await token.belanceOf(addr1.address);
        expect(addr1Balance).to.equal(100);

        const addr2Balance = await token.belanceOf(addr2.address);
        expect(addr2Balance).to.equal(50);
    })
  });
});