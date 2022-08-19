{
	description = "phaser-game";
	
	inputs.nixpkgs.url = "nixpkgs/nixos-22.05";
	inputs.flake-utils.url = "github:numtide/flake-utils";
	
	outputs = { self, nixpkgs, flake-utils }:
		flake-utils.lib.eachDefaultSystem
			(system:
		    let pkgs = import nixpkgs {
					inherit system;
				};
				in {
          devShell = pkgs.mkShell {
						nativeBuildInputs = with pkgs; [
							nodejs-18_x
							yarn
							pre-commit
						];
					};
        }
		  );
}
